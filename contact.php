<?php
// =============================================
// STILETTA PARIS — Traitement formulaire contact
// =============================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.stiletta-paris.com');

// Vérification méthode
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// Anti-spam honeypot
if (!empty($_POST['_gotcha'])) {
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

// Récupération et nettoyage des champs
$prenom  = htmlspecialchars(trim($_POST['prenom']  ?? ''), ENT_QUOTES, 'UTF-8');
$nom     = htmlspecialchars(trim($_POST['nom']     ?? ''), ENT_QUOTES, 'UTF-8');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$sujet   = htmlspecialchars(trim($_POST['sujet']   ?? ''), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

// Validation
if (empty($prenom) || empty($nom) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Adresse e-mail invalide.']);
    exit;
}

// =============================================
// REMPLACER par votre adresse e-mail Stiletta
// =============================================
$destinataire = 'contact@stiletta-paris.com';

$sujet_email = '=?UTF-8?B?' . base64_encode('[Stiletta Paris] ' . ($sujet ?: 'Nouvelle demande')) . '?=';

$corps = "Nouvelle demande de contact — Stiletta Paris\n";
$corps .= str_repeat('─', 50) . "\n\n";
$corps .= "Prénom  : {$prenom}\n";
$corps .= "Nom     : {$nom}\n";
$corps .= "E-mail  : {$email}\n";
$corps .= "Sujet   : {$sujet}\n\n";
$corps .= "Message :\n{$message}\n\n";
$corps .= str_repeat('─', 50) . "\n";
$corps .= "Envoyé depuis stiletta-paris.com\n";

$headers  = "From: Stiletta Paris <noreply@stiletta-paris.com>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$envoye = mail($destinataire, $sujet_email, $corps, $headers);

if ($envoye) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi. Veuillez réessayer.']);
}
