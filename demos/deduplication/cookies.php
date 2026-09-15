<?php
function set_cookie($name, $value) {
    return setcookie($name, (string)$value, ['expires' => time() + 5 * 86400, 'path' => '/', 'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'httponly' => true, 'samesite' => 'Lax']);
}
function set_conversion_cookies($name, $phone) {
    set_cookie('name', $name);
    set_cookie('phone', $phone);
    set_cookie('ctime', time());
}
function has_conversion_cookies($name, $phone) {
    $timestamp = filter_var($_COOKIE['ctime'] ?? null, FILTER_VALIDATE_INT);
    $duplicate = is_string($name) && is_string($phone) && $name !== '' && $phone !== '' && $timestamp !== false && $timestamp !== null && $timestamp <= time() && time() - $timestamp < 86400 && ($_COOKIE['name'] ?? null) === $name && ($_COOKIE['phone'] ?? null) === $phone;
    if ($duplicate) set_cookie('ctime', time());
    return $duplicate;
}
