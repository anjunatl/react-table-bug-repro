<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

use Illuminate\Pagination\LengthAwarePaginator;

class DemoController extends Controller
{
    public static function data($currentPage, $perPage, $sorted, $expanded, $resized)
    {
        Log::info("Getting table data", [
            'currentPage' => $currentPage,
            'perPage' => $perPage
        ]);
        $rawTestData = Storage::disk('local')->get('test.json');
        $testData = \json_decode($rawTestData);
        $offset = $currentPage * $perPage;
        $results = array_slice($testData, $offset, $perPage);
        $totalCount = \count($testData);
        $paginator = new LengthAwarePaginator($results, $totalCount, $perPage, $currentPage);
        return $paginator;
    }
}
