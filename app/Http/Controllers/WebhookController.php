<?php

namespace App\Http\Controllers;

use App\Models\WebhookLog;
use App\Models\WhatsappMsgHistory;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        if ($request->isMethod('get')) {
            return $this->verifyWebhook($request);
        }

        return $this->processNotification($request);
    }

    /**
     * ---------------------------------------------------------
     * VERIFY WEBHOOK (META)
     * ---------------------------------------------------------
     */
    protected function verifyWebhook(Request $request)
    {
        try {
            $verifyToken = env("WHATSAPP_VERIFY_TOKEN");

            // Meta DOT notation
            $mode      = $request->query('hub_mode');
            $token     = $request->query('hub_verify_token');
            $challenge = $request->query('hub_challenge');

            //Save logs for check status
            Log::info('Webhook verification request', compact(
                'mode',
                'token',
                'verifyToken',
                'challenge'
            ));

            if ($mode === 'subscribe' && $token === $verifyToken) {
                WebhookLog::create([
                    'data' => $request->all(),
                ]);

                return response($challenge, 200)->header('Content-Type', 'text/plain');
            }

            return response('Forbidden', 403);
        } catch (Exception $e) {
            Log::error('Webhook verification error', [
                'error' => $e->getMessage(),
            ]);
            return response('Error', 500);
        }
    }

    /**
     * ---------------------------------------------------------
     * PROCESS WEBHOOK EVENTS (POST)
     * ---------------------------------------------------------
     */
    protected function processNotification(Request $request)
    {
        $data = $request->all();

        // Always save raw webhook
        WebhookLog::create([
            'data' => $data,
        ]);

        Log::info('WhatsApp Webhook Received', $data);

        foreach ($data['entry'] ?? [] as $entry) {
            foreach ($entry['changes'] ?? [] as $change) {

                $value = $change['value'] ?? [];

                /**
                 * -------------------------------------------------
                 * MESSAGE STATUS EVENTS (sent, delivered, read, failed)
                 * -------------------------------------------------
                 */
                if (!empty($value['statuses'])) {
                    foreach ($value['statuses'] as $statusData) {

                        $msgId      = $statusData['id'] ?? null;
                        $status     = $statusData['status'] ?? null;
                        $toPhone    = $statusData['recipient_id'] ?? null;
                        $fromPhone  = $value['metadata']['display_phone_number'] ?? null;
                        $timestamp  = Carbon::now();

                        // Save status log
                        WebhookLog::create([
                            'recipient_phone' => $toPhone,
                            'status'          => $status,
                            'data'            => json_encode($statusData),
                        ]);

                        if (!$msgId) {
                            continue;
                        }

                        // Failed → delete message
                        if ($status === 'failed') {
                            WhatsappMsgHistory::where('msg_id', $msgId)->delete();
                            continue;
                        }

                        $statusMap = [
                            'sent'      => 0,
                            'delivered' => 1,
                            'read'      => 2,
                        ];

                        $msg = WhatsappMsgHistory::where('msg_id', $msgId)->first();

                        if ($msg) {
                            if ($status === 'sent') {
                                $msg->sent_time = $timestamp;
                            }

                            if ($status === 'delivered') {
                                $msg->delivered_time = $timestamp;
                            }

                            if ($status === 'read') {
                                $msg->read_time = $timestamp;
                                $msg->is_read = 1;
                            }

                            $msg->status   = $statusMap[$status] ?? 0;
                            $msg->msg_type = $fromPhone === env('WAP_PHONE') ? 0 : 1;
                            $msg->platform = $fromPhone === env('WAP_PHONE') ? null : 'webhook';
                            $msg->save();
                        }
                    }
                }

                /**
                 * -------------------------------------------------
                 * INCOMING USER MESSAGE
                 * -------------------------------------------------
                 */
                if (!empty($value['messages'])) {
                    foreach ($value['messages'] as $message) {

                        $msgId     = $message['id'];
                        $from      = $message['from'];
                        $to        = $value['metadata']['display_phone_number'] ?? null;
                        $name      = $value['contacts'][0]['profile']['name'] ?? 'New User';
                        $timestamp = Carbon::now();

                        $payload = [
                            'type' => $message['type'],
                            $message['type'] => $message[$message['type']] ?? [],
                        ];

                        $relatedMsgId = $message['context']['id'] ?? null;

                        WhatsappMsgHistory::updateOrCreate(
                            ['msg_id' => $msgId],
                            [
                                'user_phone'     => $from,
                                'user_name'      => $name,
                                'msg_type'       => 1,
                                'status'         => 0,
                                'is_read'        => 0,
                                'sent_time'      => $timestamp,
                                'related_msg_id' => $relatedMsgId,
                                'message'        => json_encode($payload),
                                'platform'       => 'webhook',
                            ]
                        );
                    }
                }
            }
        }

        return response()->json(['status' => 'EVENT_RECEIVED'], 200);
    }
}
