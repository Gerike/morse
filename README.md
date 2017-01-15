# F�l�vi beadand� feladat

A feladat egy �zenetk�ld� alkalmaz�s k�sz�t�se, melyben a regisztr�lt felhaszn�l�k Morze-k�d form�j�ban k�ldhetnek egym�snak �zenetet,
amit k�s�bb a c�mzett m�r term�szetes sz�vegk�nt olvashat vissza.

A szoftvert egy NodeJS alap� webszerver k�sz�t�s�vel kell megval�s�tani, term�szetesen az �r�n tanultak felhaszn�l�s�val, tesztvez�relt fejleszt�ssel.

## A Morze-k�d

A Morze-k�d az egyes karaktereket k�dolja r�vid (`.`) �s hossz� (`-`) jelek sorozatak�nt. P�ld�ul az `A` bet� k�dja `.-`,
a `Q` bet� k�dja `--.-`, az `1`-es sz�mjegy� pedig `.---`. A Morze-k�d nem k�l�nb�zteti meg a kis- �s nagybet�ket,
hagyom�nyosan a nagybet�ket haszn�lj�k.

Egy teljes �zenet Morze-k�dol�s�hoz a karaktereket 1 sz�k�zzel, a szavakat 3 sz�k�zzel kell elv�lasztani.
P�ld�ul a `HEY JUDE` �zenet Morze-k�dja

    .... . -.--   .--- ..- -.. .
.

**Megjegyz�s:** Az �zenet elej�n �s v�g�n tal�lhat� extra sz�k�z�knek nincs szerepe, figyelmen k�v�l kell hagyni �ket.

A bet�k�n �s sz�mjegyeken k�v�l l�teznek m�g speci�lis szerv�z-k�dok is. Legismertebb p�ld�juk a nemzetk�zi SOS jelz�s,
aminek k�dja `...---...`. A szerv�z-k�dok �n�ll�, egyetlen karakterk�nt tekintend�k, �s �ltal�ban k�l�n sz�ban utaznak
egy �zenet r�szek�nt. A feladatban csak az SOS k�dra sz�ks�ges felk�sz�lni a speci�lis k�dok k�z�l.

## Interf�szek

Az alkalmaz�ssal regisztr�lt felhaszn�l�k szeretn�nek egym�snak �zenetet k�ldeni, �s a saj�tjaikat elolvasni. Ennek
megfelel�en a megold�snak 3 use-case-t kell t�mogatnia:
1. felhaszn�l� regisztr�ci�ja
2. �zenet k�ld�se regisztr�lt felhaszn�l�nak Morze-k�d form�j�ban
3. regisztr�lt felhaszn�l� fogadott �zenetinek elolvas�sa

### Regisztr�ci�

Az alkalmaz�s rendelkezzen egy `/users` API endpointtal, melyre `POST` k�r�st k�ldve elv�gezhet� egy felhaszn�l� regisztr�ci�ja.

    POST /users
    request body: { "username": "alice", "name": "Alice Green" }

Param�terek:
- username: k�telez�, a felhaszn�l�n�v
- name: opcion�lis, a felhaszn�l� teljes neve

Lehets�ges HTTP v�laszok:

1. `400` - ha m�r l�tez� felhaszn�l�n�vvel akarnak regisztr�lni
2. `200` - egy�bk�nt. Ilyenkor a v�lasz t�rzse tartalmaz egy egyedi 'tokent', ami a k�s�bbi k�r�sekben a felhaszn�l�t
azonos�tani fogja. P�ld�ul `{ "token": "ABCDEFGH123456" }`.


### �zenetk�ld�s

�zenetet k�ldeni a `/users/:username/messages` endpointra `POST`-ol�ssal lehets�ges. A HTTP k�r�s `X-Auth` nev� fejl�ce
tartalmazza a felad� tokenj�t, az URL `:username` r�sze pedig a c�mzettet azonos�tja. Az �zenet tartalma a k�r�s
t�rzs�ben utazik, egy JSON objektumban, Morze-k�d form�ban: `{ "message": "...---..." }`.

P�ld�ul ha az el�z� p�ld�ban regisztr�lt Alice szeretne Bob Tannernek (felhaszn�l�neve `bob`) egy �zenetet k�ldeni, akkor
azt �gy teheti meg:

    POST /users/bob/messages
    X-Auth: ABCDEFGH123456

    { "message": "...---..." }

Lehets�ges HTTP v�laszok:

1. `401` - ha az X-Auth fejl�c hi�nyzik, vagy a token nem tartozik regisztr�lt felhaszn�l�hoz
2. `404` - ha a c�mzett nem l�tezik
3. `202` - egy�bk�nt

### �zenetek olvas�sa

�zenetet olvasni a `/users/:username/messages` endpointra int�zett GET k�r�ssel lehet. A HTTP k�r�s `X-Auth` nev� fejl�ce
tartalmazza az �zeneteit elolvasni k�v�n� felhaszn�l� tokenj�t, amelynek �sszhangban kell lennie az URL :username
r�sz�vel.

Lehets�ges v�laszok:

1. `401` - ha az X-Auth fejl�c hi�nyzik, vagy a token nem tartozik regisztr�lt felhaszn�l�hoz
2. `403` - ha a token alapj�n nem a saj�t �zeneteit pr�b�ln� elolvasni a felhaszn�l�
3. `200` - egy�bk�nt. Ilyenkor a v�lasz t�rzse tartalmazza a felhaszn�l� �zeneteit egy JSON lista form�j�ban. A lista
egyes elemei tartalmazz�k az �zenet felad�j�nak �s c�mzettj�nek _teljes nev�t_ (ha regisztr�ci�kor nem adta meg, akkor
a felhaszn�l�nev�t), �s az �zenetet term�szetes sz�veg form�j�ban.

Az el�z� p�ld�t folytatva, ha Bob szeretn� megn�zni �zeneteit, akkor a k�vetkez� m�don teheti meg:

    Request:
    GET /users/bob/messages
    X-Auth: bobtoken

    Response:
    200 OK

    [
      { "from": "Alice Green", "to": "Bob Tanner", "message": "SOS" },
      [...other messages...]
    ]


## Megjegyz�sek

- Minden HTTP API endpoint JSON adatt�pust v�rjon �s azzal v�laszoljon. A k�ld�tt �s fogadott JSON objektumok szerkezete megtal�lhat� a p�ld�kn�l.
- A GET-es endpoint legyen idempotens m�velet, azaz egym�s ut�ni t�bbsz�ri v�grehajt�sa j�rjon ugyanazzal az eredm�nnyel. Ne m�dos�tson �llapotot az alkalmaz�sban.
- K�sz�ljenek end-to-end tesztek a HTTP API-hoz.
- A Morze-k�dban megfogalmazott �zenet dek�dol�sa r�sze a feladatnak, ne haszn�ljunk k�sz k�nyvt�rat hozz�.
Kiindul�sk�nt haszn�lhat� a jelen le�r�shoz mell�kelt `morse-code-table.js` f�jl, mely a Morze-k�dt�bl�t tartalmazza.
Nem k�telez� a mell�kelt k�dt�bla haszn�lata, b�tor�tunk mindenkit a kreativabb megold�sokra.
- Az alkalmaz�s k�dja legyen k�nnyen olvashat�, mag�t�l �rtet�d�, k�vesse a clean code elveit. Legyenek hozz� automatiz�lt tesztek. A kommenteket ker�lj�k.
- Elegend� az alkalmaz�s �llapot�t mem�ri�ban t�rolni, nem sz�ks�ges f�jlba/adatb�zisba/stb. perziszt�lni.