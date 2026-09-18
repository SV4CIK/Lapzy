# Stránka ke stažení

Statická stránka, ze které si lidi stáhnou Lapzy. Běží zdarma na GitHub Pages,
APK se nahrává do GitHub Releases (tam se velké soubory nepočítají do limitu
repozitáře).

## Co upravit před vyvěšením

Na třech místech:

| Co | Kde | Čím nahradit |
|---|---|---|
| `UZIVATEL` | dva odkazy na GitHub v `index.html` | tvoje jméno na GitHubu |
| `DOPLŇ JMÉNO` a `DOPLŇ E-MAIL` | `zasady.html` | tvoje jméno a kontaktní e-mail |
| `VERZE 1.0.0 · vydáno …` | patička `index.html` | při každém vydání |

Zásady soukromí už jsou přiložené jako `zasady.html` a odkaz v patičce na ně
míří — stačí v nich doplnit jméno a e-mail.

Adresa `…/releases/latest/download/lapzy.apk` ukazuje **vždy na nejnovější
vydání**, takže odkaz na stránce už nikdy měnit nemusíš — stačí nahrát nové
APK pod stejným názvem souboru.

## Vyvěšení, krok za krokem

1. **Repozitář.** Na GitHubu založ veřejný repozitář `lapzy`.
2. **Nahraj obsah téhle složky** (`index.html`, `zasady.html`, `icon.png`,
   `og.png` a celou složku `app/`) do kořene repozitáře. Přetažením přes web
   GitHubu to jde taky.
3. **Zapni Pages.** *Settings → Pages →* Source: **Deploy from a branch**,
   větev `main`, složka `/ (root)`. Uložit.
4. Za pár minut poběží na `https://TVOJE-JMENO.github.io/lapzy/`.

## Nahrání APK

1. Sestav APK:

   ```bash
   eas build -p android --profile preview
   ```

   (Nemáš-li Git, dej před příkaz `set EAS_NO_VCS=1`.)

2. Stáhni si hotový soubor z odkazu, který EAS vypíše, a **přejmenuj ho na
   `lapzy.apk`**.
3. Na GitHubu: *Releases → Draft a new release*. Tag `v1.0.0`, název
   `Lapzy 1.0.0`, do popisu co je nového. Přetáhni `lapzy.apk` do přílohy.
4. *Publish release.* Odkaz na stránce začne fungovat okamžitě.

## Další verze

1. Zvyš `expo.version` a `expo.android.versionCode` v `app.json`.
2. Znovu `eas build -p android --profile preview`.
3. Nové Release s novým tagem, příloha zase `lapzy.apk`.
4. Ve stránce uprav jen číslo verze v patičce.

Kdo už aplikaci má, nainstaluje novou verzi přes tu starou — data zůstanou,
protože podpisový klíč je pořád stejný (EAS ho drží za tebe).

## iPhone — verze v prohlížeči

Ve složce `app/` je celá aplikace přeložená do stránky. Na iPhonu se přidá na
plochu (*Sdílet → Přidat na plochu*) a od té chvíle se chová jako běžná
aplikace: spouští se na celou obrazovku, měří stejně a **funguje i bez
signálu** — po prvním otevření se uloží do telefonu.

Umí všechno co verze pro Android: měření startu i cíle, výsledky, export do
Excelu / CSV / TXT, generování QR, sken QR kamerou i z uložené fotky a import
souboru. Naměřená data se ukládají v telefonu, ven nejde nic.

### Jak ji přeložit znovu

```bash
npm run build:web
```

Příkaz vyexportuje aplikaci, přepíše odkazy na relativní (aby fungovala
i v podsložce, což je přesně případ GitHub Pages), přidá manifest, ikony
a obsluhu pro běh bez signálu — a hotové to složí do `web/app/`.

Když se aplikace změní, `web/app/` je potřeba přeložit znovu a nahrát na
GitHub spolu se zbytkem stránky. Telefony, které už Lapzy na ploše mají,
si novou verzi stáhnou samy při prvním otevření s připojením.

> Ve složce je prázdný soubor `.nojekyll` — v kořeni i v `app/`. Bez něj
> GitHub Pages zahodí složku `_expo/` (jména začínající podtržítkem
> přeskakuje) a aplikace se neotevře. Musí se nahrát spolu se zbytkem
> a nesmí se mazat. Ve výpisu složky bývá schovaný, protože začíná tečkou.

### Kde jsou meze

* **Musí to být Safari.** Chrome ani Firefox na iPhonu přidání na plochu
  neumí — stránka v nich jde otevřít, ale bez ikony a bez offline režimu.
* **Pípání odpočtu** si iPhone pustí až po prvním doteku na obrazovku;
  Safari neumí přehrát zvuk dřív. Stačí, že se aplikace ovládá klepáním.
* **Export souboru** se stáhne do složky *Stažené*, ne rovnou do galerie —
  Safari do galerie nepouští. QR se dá uložit stejně jako soubor nebo
  poslat přes *Sdílet*.
