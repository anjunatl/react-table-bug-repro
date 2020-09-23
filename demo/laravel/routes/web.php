<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DemoController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('landing');
});

Route::post('/data', function(Request $request) {
    $request->validate([
        'page' => 'numeric',
        'perPage' => 'numeric',
        'sorted' => 'array',
        'expanded' => 'array',
        'resized' => 'array'
    ]);

    Log::info("Got data request", [
        'params' => $request->all()
    ]);

    $sortBy = $request->input('sortBy') ? $request->input('sortBy') : [];
    $page = $request->input('page') ? $request->input('page') : 0;
    $pageSize = $request->input('pageSize') ? $request->input('pageSize') : 10;
    $expanded = $request->input('expanded') ? $request->input('expanded') : [];
    $resized = $request->input('resized') ? $request->input('resized') : [];

    $data = DemoController::data($page, $pageSize, $sortBy, $expanded, $resized);
    return response()->json($data);
});
