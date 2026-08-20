# =====================================================================
#  Yehoo - publication du projet sur GitHub
#  Depot cible : https://github.com/fofanagithub/yeho.git
#
#  Utilisation : clic droit sur ce fichier > "Executer avec PowerShell"
#  ou, depuis un terminal ouvert dans C:\YEHO :
#      powershell -ExecutionPolicy Bypass -File .\publier-github.ps1
# =====================================================================

# Git ecrit une partie de ses messages sur la sortie d'erreur : on laisse
# PowerShell continuer et on controle nous-memes les codes de retour.
$ErrorActionPreference = "Continue"
$RemoteUrl = "https://github.com/fofanagithub/yeho.git"
$Branch    = "main"

# On se place dans le dossier du script, quel que soit le repertoire courant.
Set-Location -Path $PSScriptRoot

function Etape($texte) { Write-Host "`n>> $texte" -ForegroundColor Cyan }
function Succes($texte) { Write-Host "   OK  $texte" -ForegroundColor Green }
function Souci($texte)  { Write-Host "   !!  $texte" -ForegroundColor Yellow }

# ---------------------------------------------------------------------
# 1. Verifier que Git est installe
# ---------------------------------------------------------------------
Etape "Verification de Git"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "`nGit n'est pas installe sur cette machine." -ForegroundColor Red
    Write-Host "Telechargez-le sur https://git-scm.com/download/win puis relancez ce script.`n"
    Read-Host "Appuyez sur Entree pour fermer"
    exit 1
}
Succes (git --version)

# ---------------------------------------------------------------------
# 2. Nettoyer le depot partiel cree depuis l'environnement Claude
#    (le dossier partage interdisait a git d'ecrire, il reste un verrou).
#    On ne supprime que s'il n'existe AUCUN commit : rien ne peut etre perdu.
# ---------------------------------------------------------------------
Etape "Preparation du depot local"
if (Test-Path ".git") {
    $null = git rev-parse --verify HEAD 2>&1
    if ($LASTEXITCODE -ne 0) {
        Souci "Depot incomplet detecte (aucun commit) : reinitialisation propre."
        Remove-Item -Recurse -Force ".git"
    } else {
        Succes "Depot git existant conserve, avec son historique."
    }
}

if (-not (Test-Path ".git")) {
    git init -q
    git symbolic-ref HEAD "refs/heads/$Branch"
    Succes "Depot git initialise sur la branche $Branch."
}

# ---------------------------------------------------------------------
# 3. Identite des commits
#    On reprend la configuration globale si elle existe deja.
# ---------------------------------------------------------------------
Etape "Identite pour les commits"
$nom   = (git config user.name  2>&1 | Select-Object -First 1)
$email = (git config user.email 2>&1 | Select-Object -First 1)

if ([string]::IsNullOrWhiteSpace($nom)) {
    $nom = Read-Host "Votre nom (visible dans l'historique du depot)"
    if ([string]::IsNullOrWhiteSpace($nom)) { $nom = "Fofana" }
    git config user.name $nom
}

if ([string]::IsNullOrWhiteSpace($email)) {
    Write-Host "   Cette adresse sera visible publiquement dans chaque commit."
    Write-Host "   Laissez vide pour utiliser fofanagithub@users.noreply.github.com,"
    Write-Host "   qui garde votre adresse personnelle privee."
    $email = Read-Host "Votre email"
    if ([string]::IsNullOrWhiteSpace($email)) { $email = "fofanagithub@users.noreply.github.com" }
    git config user.email $email
}
Succes "$nom <$email>"

# ---------------------------------------------------------------------
# 4. Commit
#    .gitignore exclut deja node_modules, dist, server/data et server/uploads.
# ---------------------------------------------------------------------
Etape "Enregistrement des fichiers"
git add -A

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Souci "Aucune modification a enregistrer."
} else {
    $nbFichiers = (git diff --cached --name-only | Measure-Object -Line).Lines
    git commit -q -m "Yehoo : marketplace B2B guineenne (front React + API Node/SQLite)"
    Succes "$nbFichiers fichiers enregistres dans un commit."
}

# ---------------------------------------------------------------------
# 5. Depot distant
# ---------------------------------------------------------------------
Etape "Configuration du depot distant"
$remotes = git remote
if ($remotes -contains "origin") {
    git remote set-url origin $RemoteUrl
} else {
    git remote add origin $RemoteUrl
}
Succes "origin -> $RemoteUrl"

# ---------------------------------------------------------------------
# 6. Envoi
# ---------------------------------------------------------------------
Etape "Envoi vers GitHub"
Write-Host "   Une fenetre de connexion GitHub peut s'ouvrir la premiere fois."

git branch -M $Branch
git push -u origin $Branch

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nL'envoi a echoue." -ForegroundColor Red
    Write-Host "Cause la plus frequente : le depot GitHub contient deja un fichier"
    Write-Host "(un README cree a l'ouverture du depot). Dans ce cas, lancez :"
    Write-Host ""
    Write-Host "    git pull --rebase origin $Branch" -ForegroundColor White
    Write-Host "    git push -u origin $Branch" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuyez sur Entree pour fermer"
    exit 1
}

Write-Host "`nProjet publie : https://github.com/fofanagithub/yeho" -ForegroundColor Green
Read-Host "Appuyez sur Entree pour fermer"
