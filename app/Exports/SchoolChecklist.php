<?php

namespace App\Exports;

use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithEvents;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class SchoolChecklist implements FromCollection, WithHeadings, WithDrawings
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        // Remove image column from here — images added via WithDrawings
        return collect($this->data)->map(function ($item) {
            return [
                // adjust these as per your column structure
                $item['student_name'],
                $item['father_name'],
                $item['class'],
                $item['dob'],
                $item['mobile'],
                $item['admission_no'],
                $item['address'],
                // image skipped
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Student Name',
            'Father Name',
            'Class',
            'DOB',
            'Mobile',
            'Admission No',
            'Address',
            // No Image column heading here
        ];
    }

    public function drawings()
    {
        $drawings = [];

        foreach ($this->data as $index => $item) {
            // Check that photo field exists and is not empty
            if (empty($item['photo'])) {
                continue;
            }

            // Build local file path
            $photoPath = storage_path('app/public/students_photo/' . $item['photo']);

            // Check file existence
            if (!file_exists($photoPath)) {
                Log::warning("Image not found: " . $photoPath); // Optional debug
                continue;
            }

            $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
            $drawing->setName('Photo');
            $drawing->setDescription('Student Photo');
            $drawing->setPath($photoPath); // Full local path to file
            $drawing->setHeight(80); // px
            $drawing->setCoordinates('A' . ($index + 2)); // Image in column A, row 2 onwards
            $drawings[] = $drawing;
        }

        return $drawings;
    }

}
