<?php

$data = json_decode(file_get_contents("php://input"), true);
//echo "\n\nJSON array from POST: \n";
//print_r($data);
//die();

// Формируем текст письма
$message = "<h2>Данные клиента</h2>";
$message .= "Сообщение от: {$data['form']['name']} <br>";
$message .= "Email:  {$data['form']['email']}<br>";
$message .= "Телефон:  {$data['form']['phone']}";
$message .= "<hr>";

// Текст письма, данные по заявке
$message .= "<h2>Данные по заявке</h2>";
$message .= "Стоимость недвижимости: {$data['data']['cost']} <br>";
$message .= "Первоначальный платеж: {$data['data']['payment']} <br>";
$message .= "Срок в годах: {$data['data']['time']} <br>";
$message .= "<hr>";

// Результаты расчета
$message .= "<h2>Результаты расчета</h2>";
$message .= "Процентная ставка: {$data['resultData']['rate']} <br>";
$message .= "Сумма кредита: {$data['resultData']['totalAmount']} <br>";
$message .= "Ежемесячный платеж: {$data['resultData']['monthPayment']} <br>";
$message .= "Переплата: {$data['resultData']['overPayment']} <br>";

// Отправляем письмо и результат отправки успех/неуспех true/false записываем в $result
$result = mail('info@mail.com', 'Заявка на ипотеку', $message);

echo $result ? "SUCCESS" : "FAILED";
