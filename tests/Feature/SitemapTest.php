<?php

test('sitemap returns successful response', function () {
    $response = $this->get('/sitemap.xml');

    $response->assertStatus(200);
    $response->assertHeader('Content-Type', 'application/xml');
});

test('articles index returns successful response', function () {
    $response = $this->get('/articles');
    $response->assertStatus(200);
});
