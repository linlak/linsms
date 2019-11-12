<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

	<head>
		<title>Home - {{config('app.name')}}</title>
		<!-- CSRF Token -->
		<meta name="csrf-token" content="{{ csrf_token() }}">
		<base href="/">
		<meta name="fragment" content="!">
		<link rel="manifest" href="/manifest.json">
		<meta property="og:title" content="{{config('app.name')}}" />
		<meta property="og:image" content="/images/lin.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		{{-- <link href="http://yandex.st/highlightjs/8.0/styles/github.min.css" rel="stylesheet" type="text/css"> --}}
		<style type="text/stylesheet">
			@-webkit-viewport   { width: device-width; }
		@-moz-viewport      { width: device-width; }
		@-ms-viewport       { width: device-width; }
		@-o-viewport        { width: device-width; }
		@viewport           { width: device-width; }
	</style>
		<script type="text/javascript">
			//<![CDATA[
		if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
			let msViewportStyle = document.createElement("style");
			msViewportStyle.appendChild(
				document.createTextNode("@-ms-viewport{width:auto!important}")
			);
			document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
		}
		//]]>
		</script>
		<meta name="google-site-verification" content="ZvrGIpZ3QlvXz-W7_bg6y1wgX-Vnh0Pvlj_bw3KnDVc" />
		<meta name="HandheldFriendly" content="true" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="keywords"
			content="bulksms, sms api, online payments, web design, sms, linsms, sms marketing, database management" />
		<meta name="description"
			content="linsms is an online bulk sms marketing system dedicted to enable indivals, businesses and companies to send sms to their frequent customers and for mass gatherings from their internet enabled devices like pcs and mobile">
		<meta name="robots" content="index, follow" />
		<meta name="apple-mobile-web-app-capable" content="YES" />
		<meta name="format-detection" content="telephone=no" />
		<link rel="preconnect" href="//www.google.com">
		<link rel="preconnect" href="//www.facebook.com">
		<link rel="preconnect" href="//www.twitter.com">

		<link rel="stylesheet" type="text/css" href="/sms-app/libs/bootstrap-4.3.1/css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="/sms-app/src/css/animate.min.css">
		<link rel="stylesheet" type="text/css" href="/sms-app/libs/fontawesome-free-5.6.1-web/css/all.min.css">
		<link rel="stylesheet" type="text/css" href="/sms-app/libs/angular-loading-bar/build/loading-bar.min.css">
		<link rel="stylesheet" type="text/css" href="/sms-app/libs/angular-toaster/toaster.min.css">
		<link rel="stylesheet" type="text/css" href="/sms-app/libs/lightbox/angular-bootstrap-lightbox.min.css">
		<link rel="stylesheet" type="text/css" href="/sms-app/src/css/mystyles.css">
		<link rel="stylesheet" type="text/css" href="/sms-app/src/css/scroll_up.css">
		<link rel="alternate" type="application/rss+xml" href="/rss.xml">
		<link rel="icon" type="image/png" sizes="32x32" href="/images/linfav.png">
		<link rel="stylesheet" href="/sms-app/libs/quill/quill.snow.css" />
		<link rel="stylesheet" href="/sms-app/libs/quill/quill.bubble.css" />
	</head>

	<body class=" mx-auto px-1">
		<div class="container-fluid px-1 mx-auto">
			<div class="row no-gutters">
				<div class="col-12">
					<div ui-view class="page"></div>
					<div id="p-loading" class="text-white bg-secondary shadow-sm align-items-center">
						<span class="fa fa-spinner fa-spin fa-2x"></span><br>
						Please wait...
					</div>
					<div id="p-reload"  style="{display: none;}" class="text-white bg-secondary shadow-sm align-items-center">
					<span>
					Error loading page!!</span><br>
					<button class="btn btn-primary" onclick="refPage()">
					<span class="fa fa-reload"></span> Refresh
					</button>
					</div>
				</div>
			</div>

		</div>
		<script type="text/javascript">
			function showLoading() {
			document.getElementById("p-loading").style.display="block";
			document.getElementById("p-reload").style.display="none";
		}
		function hideLoading() {
			document.getElementById("p-loading").style.display="none";

		}
		function showReload() {
			hideLoading();
			document.getElementById("p-reload").style.display="block";

		}
		function refPage(){
			document.location.reload();
		}
		showLoading();
		</script>
		<!-- <script type="text/javascript" src="/worker-register.js"></script> -->
		<script type="text/javascript" data-main="/sms-app/main" src="/sms-app/libs/js/require.js"></script>
	</body>

</html>