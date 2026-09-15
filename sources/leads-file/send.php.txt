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
$directory = realpath(getenv('YWB_LEADS_DIR') ?: '');
$webroot = realpath($_SERVER['DOCUMENT_ROOT']);
if (!$directory || !$webroot || str_starts_with(strtolower($directory . DIRECTORY_SEPARATOR), strtolower($webroot . DIRECTORY_SEPARATOR)) || !is_writable($directory)) {
    http_response_code(503); echo json_encode(['error' => 'Configure a writable directory outside the web root']); exit;
}
$line = json_encode(['name' => trim($name), 'phone' => trim($phone), 'date' => gmdate('c')], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE) . "\n";
$saved = file_put_contents($directory . DIRECTORY_SEPARATOR . 'orders.jsonl', $line, FILE_APPEND | LOCK_EX) !== false;
http_response_code($saved ? 200 : 500);
echo json_encode(['ok' => $saved]);
