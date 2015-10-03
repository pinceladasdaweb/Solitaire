require(["vcountdown", "solitaire"], function (VCountdown, Solitaire) {
    VCountdown.init({
        target: '.tweet'
    });

    Solitaire();
});