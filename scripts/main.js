// --- Definicja naszego nowego efektu eksplozji ---

const orangeReactorExplosion = new Effect(90, e => {
    // Czas trwania efektu w klatkach (90 = 1.5 sekundy)

    // Rysujemy falę uderzeniową, która zmienia kolor i rozmiar
    Draw.color(Color.valueOf("ffaa5f"), Color.valueOf("ff5500"), e.fin());
    Lines.stroke(e.fout() * 4); // Grubość linii maleje z czasem
    Lines.circle(e.x, e.y, e.fin() * 160); // Promień okręgu rośnie z czasem (160 pikseli = 20 bloków)

    // Dodajemy losowe, jasne błyski dla lepszego efektu
    Draw.color(Color.white);
    for(let i = 0; i < 4; i++){
        Angles.randLenVectors(e.id, 6, e.fin() * 120, (x, y) => {
            Fill.circle(e.x + x, e.y + y, e.fout() * 4);
        });
    }

    // Dodajemy efekt dymu
    if(e.fin() > 0.1){
        Effects.effect(Fx.smoke, e.x, e.y);
    }
});

// --- Mechanika rozrzucania ognia ---

const fireTrail = new Effect(30, e => {
    // Mały, niewidzialny efekt, który podpala ziemię
    // Tworzymy kałużę płonącego żużlu w miejscu, gdzie uderzy
    Damage.createIncend(e.x, e.y, 4, 120); // promień 4, czas trwania 120 klatek
});

const fireSpreader = extend(BasicBulletType, {
    // Niewidzialny pocisk, który niesie ze sobą efekt podpalenia
    width: 0,
    height: 0,
    speed: 3,
    lifetime: 50,
    drag: 0.05,
    despawnEffect: fireTrail, // Gdy pocisk zniknie, odpala efekt fireTrail
    collides: false // Nie zderza się z niczym
});


// --- Łączymy wszystko w jedną funkcję ---

function createFireExplosion(x, y){
    // Odtwarzamy nasz główny, pomarańczowy efekt wizualny
    Effects.effect(orangeReactorExplosion, x, y);

    // Wystrzeliwujemy 15 niewidzialnych pocisków w losowych kierunkach, które podpalą ziemię
    for(let i = 0; i < 15; i++){
        Calls.createBullet(fireSpreader, Team.derelict, x, y, Angles.random(), 1, 1);
    }
}

// --- Przypisujemy nasz nowy efekt do NASZEGO reaktora ---

// Bierzemy nasz reaktor po jego pełnej nazwie ("nazwa-moda-nazwa-bloku")
const myReactor = Vars.content.getByName(ContentType.block, "thermal-revolution-thermal-reactor");

// Zastępujemy jego domyślny, pusty efekt eksplozji naszą nową funkcją
myReactor.explodeEffect = new Effect(0, e => {
    createFireExplosion(e.x, e.y);
});