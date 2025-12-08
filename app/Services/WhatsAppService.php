<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;

class WhatsAppService
{

    /**================================
     * Send OTP Message
     *
     * @param string $phone WhatsApp Phone Number
     * @param string $otp OTP
     */
    public static function sendOTP($phone, $otp)
    {
        try {
            $msgData = [
                "messaging_product" => "whatsapp",
                "recipient_type" => "individual",
                "to" => "91$phone",
                "type" => "template",
                "template" => [
                    "name" => env('MSG_TEMPLATE'),
                    "language" => [
                        "code" => "en_US"
                    ],
                    "components" => [
                    [
                        "type" => "body",
                        "parameters" => [
                            [
                                "type" => "text",
                                "text" => $otp
                            ],
                        ]
                    ],


                    ]
                ]

            ];

            $req = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer '.env('APP_ACCESS_TOKEN')
            ])->post(env('GRAPH_API_URL') .'/'. env('GRAPH_API_VER') .'/'. env('PHONE_NUMBER_ID') .'/messages', $msgData);
            if($req->successful()){
                return [
                    'status' => true,
                    'message' => 'OTP sent successfully'
                ];
            }


            $resp = $req->json();
            if($resp['error']['code'] === 131009){
                return [
                    'status' => false,
                    'message' => 'Number does not have a WhatsApp Account!'
                ];
            } else if($resp['error']['code'] === 100){
                return [
                    'status' => false,
                    'message' => 'Invalid Phone number or does not have WhatsApp Account!',
                    'error' => $resp['error']['code'].':'.$resp['error']['message']
                ];
            }


            return [
                'status' => false,
                'message' => $resp['error']['code'].':'.$resp['error']['message'],
                'code' => $req->status()
            ];
        } catch (\Exception $e) {
            return $e->getMessage();
        }

    }

/**
 * Send Message Without header
 * SEND MESSAGE WHEN ORDER Cancelled / Rescheduled
 * if any template not have header then create bellow like below funciton
 *
*/
public static function sendWhatsAppMessage($phone, $template, $data)
{
    try{
        $msgData = [
            "messaging_product" => "whatsapp",
            "recipient_type" => "individual",
            "to" => "91$phone",
            "type" => "template",
            "template" => [
                "name" => $template,
                "language" => [
                    "code" => "en"
                ],
                "components" => [
                    [
                        "type" => "body",
                        "parameters" => [
                            [
                                "type" => "text",
                                "text" => (!empty($data['equipment_name'])) ? $data['equipment_name']: ""
                            ],
                            [
                                "type" => "text",
                                "text" => (!empty($data['date'])) ? $data['date']: ""
                            ],
                            [
                                "type" => "text",
                                "text" => (!empty($data['time'])) ? $data['time']: ""
                            ],
                            [
                                "type" => "text",
                                "text" => (!empty($data['status'])) ? $data['status']: ""
                            ],

                        ]
                    ],

                ]
            ]
        ];

        $req = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer '.env('APP_ACCESS_TOKEN')
        ])->post(env('GRAPH_API_URL') .'/'. env('GRAPH_API_VER') .'/'. env('PHONE_NUMBER_ID') .'/messages', $msgData);

        if ($req->successful()) {
            return [
                'status' => true,
                'message' => 'Message sent successfully'
            ];
        }

        $resp = $req->json();
        if ($resp['error']['code'] === 131009) {
            return [
                'status' => false,
                'message' => 'Number does not have a WhatsApp Account!'
            ];
        } else if ($resp['error']['code'] === 100) {
            return [
                'status' => false,
                'message' => 'Invalid Phone number or does not have WhatsApp Account!',
                'error' => $resp['error']['code'] . ':' . $resp['error']['message']
            ];
        }

        return [
            'status' => false,
            'message' => $resp['error']['code'] . ':' . $resp['error']['message'],
            'code' => $req->status()
        ];
    } catch (\Exception $e) {
        return $e->getMessage();
    }
}


/**
 * Send Message Without header
 * SEND MESSAGE WHEN ORDER Complited
 * if any template not have header then create bellow like below funciton
 *
*/
public static function sendDeliveredWhatsAppMessage($phone, $template, $data)
{
    try{
        $msgData = [
            "messaging_product" => "whatsapp",
            "recipient_type" => "individual",
            "to" => "91$phone",
            "type" => "template",
            "template" => [
                "name" => $template,
                "language" => [
                    "code" => "en"
                ],
                "components" => [
                    [
                        "type" => "body",
                        "parameters" => [
                            [
                                "type" => "text",
                                "text" => (!empty($data['staff_name'])) ? $data['staff_name']: ""
                            ],
                            [
                                "type" => "text",
                                "text" => (!empty($data['equipment_name'])) ? $data['equipment_name']: ""
                            ],
                            [
                                "type" => "text",
                                "text" => (!empty($data['doctor_name'])) ? $data['doctor_name']: ""
                            ],

                            [
                                "type" => "text",
                                "text" => (!empty($data['date'])) ? $data['date']: ""
                            ],
                            [
                                "type" => "text",
                                "text" => (!empty($data['time'])) ? $data['time']: ""
                            ]

                        ]
                    ],

                ]
            ]
        ];

        $req = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer '.env('APP_ACCESS_TOKEN')
        ])->post(env('GRAPH_API_URL') .'/'. env('GRAPH_API_VER') .'/'. env('PHONE_NUMBER_ID') .'/messages', $msgData);

        if ($req->successful()) {
            return [
                'status' => true,
                'message' => 'Message sent successfully'
            ];
        }

        $resp = $req->json();
        if ($resp['error']['code'] === 131009) {
            return [
                'status' => false,
                'message' => 'Number does not have a WhatsApp Account!'
            ];
        } else if ($resp['error']['code'] === 100) {
            return [
                'status' => false,
                'message' => 'Invalid Phone number or does not have WhatsApp Account!',
                'error' => $resp['error']['code'] . ':' . $resp['error']['message']
            ];
        }

        return [
            'status' => false,
            'message' => $resp['error']['code'] . ':' . $resp['error']['message'],
            'code' => $req->status()
        ];
    } catch (\Exception $e) {
        return $e->getMessage();
    }
}


/**============================================
 *This function is use for send order related whatsapp message
*/
public static function sendOrderWhatsAppMessage($phone, $template, $data)
{
    try{
        $msgData = [
            "messaging_product" => "whatsapp",
            "recipient_type" => "individual",
            "to" => "91$phone",
            "type" => "template",
            "template" => [
                "name" => $template,
                "language" => [
                    "code" => "en"
                ],
                "components" => [
                    [
                        "type" => "body",
                        "parameters" => [
                            [
                                "type" => "text",
                                "text" => (!empty($data['equipment_name'])) ? $data['equipment_name']: ""
                            ],
                            [
                                "type" => "text",
                                "text" => (!empty($data['date'])) ? $data['date']: ""
                            ],
                            [
                                "type" => "text",
                                "text" => (!empty($data['time'])) ? $data['time']: ""
                            ],

                        ]
                    ],

                ]
            ]
        ];

        $req = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer '.env('APP_ACCESS_TOKEN')
        ])->post(env('GRAPH_API_URL') .'/'. env('GRAPH_API_VER') .'/'. env('PHONE_NUMBER_ID') .'/messages', $msgData);

        if ($req->successful()) {
            return [
                'status' => true,
                'message' => 'Message sent successfully'
            ];
        }

        $resp = $req->json();
        if ($resp['error']['code'] === 131009) {
            return [
                'status' => false,
                'message' => 'Number does not have a WhatsApp Account!'
            ];
        } else if ($resp['error']['code'] === 100) {
            return [
                'status' => false,
                'message' => 'Invalid Phone number or does not have WhatsApp Account!',
                'error' => $resp['error']['code'] . ':' . $resp['error']['message']
            ];
        }

        return [
            'status' => false,
            'message' => $resp['error']['code'] . ':' . $resp['error']['message'],
            'code' => $req->status()
        ];
    } catch (\Exception $e) {
        return $e->getMessage();
    }
}


/**============================================
 *This function is use for assign staff to order whatsapp message
*/
public static function sendAssignStaffWhatsAppMessage($phone, $template, $data)
{
    try{
        $msgData = [
            "messaging_product" => "whatsapp",
            "recipient_type" => "individual",
            "to" => "91$phone",
            "type" => "template",
            "template" => [
                "name" => $template,
                "language" => [
                    "code" => "en"
                ],
                "components" => [
                    [
                        "type" => "body",
                        "parameters" => [
                            [
                                "type" => "text",
                                "text" => (!empty($data['equipment_name'])) ? $data['equipment_name']: ""
                            ],
                            [
                                "type" => "text",
                                "text" => (!empty($data['staff_name'])) ? $data['staff_name']: ""
                            ]

                        ]
                    ],

                ]
            ]
        ];

        $req = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer '.env('APP_ACCESS_TOKEN')
        ])->post(env('GRAPH_API_URL') .'/'. env('GRAPH_API_VER') .'/'. env('PHONE_NUMBER_ID') .'/messages', $msgData);

        if ($req->successful()) {
            return [
                'status' => true,
                'message' => 'Message sent successfully'
            ];
        }

        $resp = $req->json();
        if ($resp['error']['code'] === 131009) {
            return [
                'status' => false,
                'message' => 'Number does not have a WhatsApp Account!'
            ];
        } else if ($resp['error']['code'] === 100) {
            return [
                'status' => false,
                'message' => 'Invalid Phone number or does not have WhatsApp Account!',
                'error' => $resp['error']['code'] . ':' . $resp['error']['message']
            ];
        }

        return [
            'status' => false,
            'message' => $resp['error']['code'] . ':' . $resp['error']['message'],
            'code' => $req->status()
        ];
    } catch (\Exception $e) {
        return $e->getMessage();
    }
}

/**============================================
 *This function is use for new arrival equipment whatsapp message
*/
public static function sendNewArrivalWhatsAppMessage($phone, $template, $data)
{
    try{
        $msgData = [
            "messaging_product" => "whatsapp",
            "recipient_type" => "individual",
            "to" => "91$phone",
            "type" => "template",
            "template" => [
                "name" => $template,
                "language" => [
                    "code" => "en"
                ],
                "components" => [
                    [
                        "type" => "body",
                        "parameters" => [
                            [
                                "type" => "text",
                                "text" => (!empty($data['equipment_name'])) ? $data['equipment_name']: ""
                            ]
                        ]
                    ],

                ]
            ]
        ];

        $req = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer '.env('APP_ACCESS_TOKEN')
        ])->post(env('GRAPH_API_URL') .'/'. env('GRAPH_API_VER') .'/'. env('PHONE_NUMBER_ID') .'/messages', $msgData);

        if ($req->successful()) {
            return [
                'status' => true,
                'message' => 'Message sent successfully'
            ];
        }

        $resp = $req->json();
        if ($resp['error']['code'] === 131009) {
            return [
                'status' => false,
                'message' => 'Number does not have a WhatsApp Account!'
            ];
        } else if ($resp['error']['code'] === 100) {
            return [
                'status' => false,
                'message' => 'Invalid Phone number or does not have WhatsApp Account!',
                'error' => $resp['error']['code'] . ':' . $resp['error']['message']
            ];
        }

        return [
            'status' => false,
            'message' => $resp['error']['code'] . ':' . $resp['error']['message'],
            'code' => $req->status()
        ];
    } catch (\Exception $e) {
        return $e->getMessage();
    }
}

/**============================================
 *This function is use for start Deivery equipment whatsapp message
*/
public static function sendStartDeliveryWhatsAppMessage($phone, $template, $data)
{
    try{
        $msgData = [
            "messaging_product" => "whatsapp",
            "recipient_type" => "individual",
            "to" => "91$phone",
            "type" => "template",
            "template" => [
                "name" => $template,
                "language" => [
                    "code" => "en"
                ],
                "components" => [
                    [
                        "type" => "body",
                        "parameters" => [
                            [
                                "type" => "text",
                                "text" => (!empty($data['equipment_name'])) ? $data['equipment_name']: ""
                            ]
                        ]
                    ],

                ]
            ]
        ];

        $req = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer '.env('APP_ACCESS_TOKEN')
        ])->post(env('GRAPH_API_URL') .'/'. env('GRAPH_API_VER') .'/'. env('PHONE_NUMBER_ID') .'/messages', $msgData);

        if ($req->successful()) {
            return [
                'status' => true,
                'message' => 'Message sent successfully'
            ];
        }

        $resp = $req->json();
        if ($resp['error']['code'] === 131009) {
            return [
                'status' => false,
                'message' => 'Number does not have a WhatsApp Account!'
            ];
        } else if ($resp['error']['code'] === 100) {
            return [
                'status' => false,
                'message' => 'Invalid Phone number or does not have WhatsApp Account!',
                'error' => $resp['error']['code'] . ':' . $resp['error']['message']
            ];
        }

        return [
            'status' => false,
            'message' => $resp['error']['code'] . ':' . $resp['error']['message'],
            'code' => $req->status()
        ];
    } catch (\Exception $e) {
        return $e->getMessage();
    }
}

}
