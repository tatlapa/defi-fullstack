<?php

use App\Http\Controllers\HotelController;
use Illuminate\Support\Facades\Route;

Route::controller(HotelController::class)->prefix('hotels')->group(function () {
    Route::get('/', 'getHotels');
    Route::get('/{id}', 'getHotel');
    Route::post('/', 'createHotel');
    Route::delete('/{id}', 'deleteHotel');
});