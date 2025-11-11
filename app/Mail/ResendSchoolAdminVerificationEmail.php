<?php

namespace App\Mail;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResendSchoolAdminVerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $admin;
    protected $subjectLine;

    /**
     * Create a new message instance.
     *
     * @param $admin
     * @param $subject
     */
    public function __construct($admin, $subject = null)
    {
        $this->admin = $admin;
        $this->subjectLine = $subject ?? 'Verify Your Email - ' . env('APP_NAME');
    }

    /**
     * Build the message.
     */
    public function build()
    {
        try{
            return $this->view('emails.account_verification_email')
                ->with([
                    'admin' => $this->admin,
                ])
                ->from('noreply@idmitra.com', env('APP_NAME') . ' - Admin')
                ->subject($this->subjectLine);
        }catch(Exception $e){
            dd($e->getMessage());
        }
    }

    public function getSubject()
    {
        return $this->subjectLine;
    }
}
