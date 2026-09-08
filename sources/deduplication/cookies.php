<?php
function set_cookie($name,$value){
	$expires = time()+60*60*24*5; //время, на которое ставятся куки, по умолчанию - 5 дней
	header("Set-Cookie: {$name}={$value}; Expires={$expires}; Path=/; SameSite=None; Secure",false);
}

function set_conversion_cookies($name,$phone){
	set_cookie('name',$name);
	set_cookie('phone',$phone);
	$date = new DateTime();
	$ts = $date->getTimestamp();
	set_cookie('ctime',$ts);
}

//проверяем, если у пользователя установлена куки, что он уже конвертился, а также имя и телефон, то сверяем время
//если прошло менее суток, то хуй ему, а не лид, обнуляем время
function has_conversion_cookies($name,$phone){
	$date = new DateTime();
	$ts = $date->getTimestamp();
	$is_duplicate=false;
	$cname = isset($_COOKIE['name'])?$_COOKIE['name']:'';
	$cphone = isset($_COOKIE['phone'])?$_COOKIE['phone']:'';
	$ctime = isset($_COOKIE['ctime'])?$_COOKIE['ctime']:'';
	
	if (!empty($ctime)&&!empty($name)&&!empty($phone)){
		if ($cname===$name&&$cphone===$phone){
			$secondsDiff = $ts - $ctime;
			if ($secondsDiff<24*60*60)
			{
				$is_duplicate=true;
				set_cookie('ctime',$ts);
			}
		}
	}
	return $is_duplicate;
}
?>