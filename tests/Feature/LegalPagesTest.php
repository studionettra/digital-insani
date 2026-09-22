<?php

it('can render refund policy page', function () {
    $response = $this->get(route('legal.refund'));

    $response->assertOk();
});

it('can render terms of service page', function () {
    $response = $this->get(route('legal.terms'));

    $response->assertOk();
});

it('can render privacy policy page', function () {
    $response = $this->get(route('legal.privacy'));

    $response->assertOk();
});
