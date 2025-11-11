<?php

namespace App\Exports;

use Illuminate\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExportSchoolStaff implements FromView, WithStyles
{
    protected $data;
    public function __construct($data)
    {
        $this->data = $data;
    }

    public function styles(Worksheet $sheet)
    {
        $range = "A1:P1";
        $sheet->getStyle($range)->getFont()->setBold(true);
        $sheet->getStyle($range)->getFont()->getColor()->setARGB(Color::COLOR_WHITE);
        $sheet->getStyle($range)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($range)->getFill()->setFillType(Fill::FILL_SOLID);
        $sheet->getStyle($range)->getFill()->getStartColor()->setARGB(Color::COLOR_BLACK);
    }

    public function view(): View
    {
        return view('exports.school_staff', [
            'staff' => $this->data
        ]);
    }
}
