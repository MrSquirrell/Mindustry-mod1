// Czekamy na załadowanie gry po stronie klienta
Events.on(ClientLoadEvent, () => {

    // --- 1. Definicja samego WYGLĄDU eksplozji (Twoja działająca wersja) ---
    const orangeReactorExplosion = new Effect(90, e => {
        Draw.color(Color.valueOf("ffaa5f"), Color.valueOf("ff5500"), e.fin());
        Lines.stroke(e.fout() * 4);
        Lines.circle(e.x, e.y, e.fin() * 160);

        Draw.color(Color.white);
        for(let i = 0; i < 4; i++){
            Angles.randLenVectors(e.id + i, 6, e.fin() * 120, (x, y) => {
                Fill.circle(e.x + x, e.y + y, e.fout() * 4);
            });
        }
    });

    // --- 2. Wyszukanie moda i reaktora (Twoja działająca wersja) ---
    const thisMod = Vars.mods.list().find(m => m.name === "thermal-revolution");
    if(thisMod){
        const myReactor = Vars.content.getByName(ContentType.block, thisMod.name + "-thermal-reactor");
        if(myReactor){
            // --- 3. Zapisujemy oryginalny efekt na później ---
            const originalExplosion = myReactor.explodeEffect;

            // --- 4. Nadpisujemy ZACHOWANIE reaktora, aby dodać warunek ---
            myReactor.buildType = () => extend(ConsumeGenerator.ConsumeGeneratorBuild, myReactor, {
                // Nadpisujemy funkcję, która jest wywoływana, gdy blok jest niszczony
                onDestroyed(){
                    // Sprawdzamy, czy w reaktorze jest żużel
                    if(this.liquids.get(Liquids.slag) > 0.1){
                        // Jeśli tak, podmieniamy domyślny efekt na nasz piękny, pomarańczowy.
                        this.block.explodeEffect = orangeReactorExplosion;
                    }
                    
                    // Wywołujemy oryginalną funkcję zniszczenia. Gra zajmie się resztą.
                    this.super$onDestroyed();

                    // Na końcu przywracamy oryginalny efekt, żeby nie psuć innych reaktorów.
                    this.block.explodeEffect = originalExplosion;
                }
            });

            Log.info("[Thermal Revolution] Nałożono OSTATECZNĄ, STABILNĄ wersję warunkowej eksplozji.");
        }
    }
});