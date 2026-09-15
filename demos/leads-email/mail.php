<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
$name = $_POST['name'] ?? null;
$phone = $_POST['phone'] ?? null;
if (!is_string($name) || !is_string($phone) || trim($name) === '' || trim($phone) === '' || strlen($name) > 300 || strlen($phone) > 80) {
    http_response_code(422); echo json_encode(['error' => 'Name and phone are required']); exit;
}
if (getenv('YWB_LIVE') !== '1') { echo json_encode(['ok' => true, 'mode' => 'dry-run']); exit; }
$to = getenv('YWB_MAIL_TO');
$from = getenv('YWB_MAIL_FROM');
if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) { http_response_code(503); echo json_encode(['error' => 'Mail is not configured']); exit; }
$body = "Name: " . trim($name) . "\nPhone: " . trim($phone);
$sent = mail($to, 'Landing order', $body, ['From' => $from, 'Content-Type' => 'text/plain; charset=UTF-8']);
http_response_code($sent ? 200 : 502);
echo json_encode(['ok' => $sent]);
