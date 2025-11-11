<?php

namespace App\Jobs;

use App\Models\Card;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Milon\Barcode\Facades\DNS2DFacade as DNS2D;


class GenerateBarcode implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $card;
    /**
     * Create a new job instance.
     */
    public function __construct($card)
    {
        $this->card = $card;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        try {

            $card = Card::find($this->card->id);

            $card = Card::find($this->card->id);
            if (!$card) {
                return false;
            }

            $user = $card->user;

            $cardLink = route("front.card.check", ['barcode_uuid' => $card->barcode_uuid]);
            // $barcode = DNS2D::getBarcodePNG($cardLink, 'QRCODE', 5, 5, array(1, 1, 1));

            $barcode = DNS2D::getBarcodePNG(
                $cardLink,
                'QRCODE',          // Barcode type (QR code)
                10,                 // Width of the barcode
                10,                 // Height of the barcode
                [0, 0, 0]        // RGB color values for green (use [0, 0, 0] for black)
            );

            if (!$barcode) {
                return response()->json(['error' => 'Barcode generation failed'], 500);
            }

            $bname = $card->barcode_uuid . '.png';
            if (!$card->barcode_file) {
                $card->barcode_file = $bname;
                $card->save();
                $barcodePath = 'barcodes/' . $bname;
                Storage::disk('public')->put($barcodePath, base64_decode($barcode));
            }
            $card->save();

            if ($user) {
                $user->barcode_photo = $bname;
                $user->save();
            }
        } catch (Exception $e) {
            Log::info($e->getMessage());
        }
    }
}
