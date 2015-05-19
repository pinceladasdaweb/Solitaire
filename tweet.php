<?php
require_once './vendor/autoload.php';
require_once './vendor/Solitaire/config.php';

$codebirdLoader = new SplClassLoader('Codebird', 'vendor');
$solitaireLoader = new SplClassLoader('Solitaire', 'vendor');

$codebirdLoader->register();
$solitaireLoader->register();

use Solitaire\Solitaire;

if (!empty($_POST)) {
    $status = $_POST['tweet'];

    $tweet = new Solitaire($status);
    $tweet->post();
}