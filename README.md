# Codenames

Web verzija društvene igre Codenames, osobni projekt. Igra podržava real-time multiplayer, prilagođena je za mobilne uređaje i uključuje sustav odbrojavanja za poteze.

## Značajke

- Real-time multiplayer putem Socket.io (svi igrači vide poteze drugih uživo, bez potrebe za osvježavanjem stranice)
- Mobilno responzivan dizajn, igra se može igrati i na telefonu
- Sustav odbrojavanja (countdown timer) za poteze

## Tehnologije

- Node.js
- Express
- EJS (predlošci)
- Socket.io

## Pokretanje projekta

1. Kloniraj repozitorij:
   ```
   git clone https://github.com/filippintaricc-sketch/codenames-game.git
   cd codenames-game
   ```
2. Instaliraj ovisnosti:
   ```
   npm install
   ```
3. Pokreni server:
   ```
   node server
   ```
4. Otvori preglednik na adresi ispisanoj u terminalu

Projekt ne zahtijeva `.env` datoteku niti dodatnu konfiguraciju za pokretanje.

## Varijable okruženja

Lokalno nisu potrebne, ali na serveru (npr. Render) se postavljaju:

| Varijabla | Zadano | Opis |
|---|---|---|
| `PORT` | `8080` | Port na kojem server sluša. Render ga postavlja sam. |
| `SESSION_SECRET` | `anything` | Tajni ključ za potpisivanje session kolačića. Na serveru postavi dugi nasumični niz. |

## Kako se igra

Otvori aplikaciju u više prozora/uređaja da isprobaš multiplayer, pridruži se igri i igraj Codenames s prijateljima uživo.
