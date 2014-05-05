function translationCallback(data) {
    var $definitions = $('.definitions');
    var $d = $('<div class="definition">');

    var $phrase = $('<h2 class="phrase">');
    $phrase.text(data.phrase).appendTo($d);

    // If no result was found, link to the Collins French-English dictionary.
    if (!data.tuc.length) {
        var $notFound = $('<div class="not-found">').text("Not found; check ");
        var href = 'http://www.collinsdictionary.com/dictionary/french-english/';
        href += data.phrase.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-');
        var $a = $('<a>').attr('href', href).text("Collins dictionary");
        $a.appendTo($notFound);
        $notFound.appendTo($d);
        $d.prependTo($definitions);
        return;
    }
    
    $('<h3>English Translations</h3>').appendTo($d);
    var $translations = $('<ol class="translations">').appendTo($d);
    $('<h3>Other Meanings</h3>').appendTo($d);
    var $meanings = $('<ul class="meanings">').appendTo($d);

    for (var i = 0; i < data.tuc.length; i++) {
        var t = data.tuc[i];
        if (t.phrase) {
            var $t = $('<li class="translation">').appendTo($translations);
            $t.append('<strong>' + t.phrase.text + '</strong>');
            var $ul = $('<ul>').appendTo($t);
            if (t.meanings) {
                for (var j = 0; j < t.meanings.length; j++) {
                    var m = t.meanings[j];
                    $ul.append($('<li>').html(m.text));
                }
            }
        }
        else {
            if (t.meanings) {
                for (var j = 0; j < t.meanings.length; j++) {
                    var m = t.meanings[j];
                    $meanings.append($('<li>').html(m.text));
                }
            }
        }
    }

    $d.prependTo($definitions);
}

$(function() {
    var $edit, $definitions, $save, $search, $ta, $text;

    $edit = $('.edit');
    $definitions = $('.definitions');
    $save = $('.save');
    $search = $('.search');
    $ta = $('.ta');
    $text = $('.text');

    function getSelection() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }

    function edit() {
        $ta.show();
        $text.hide();
        $save.show();
        $edit.hide();
    }

    function lookup(e) {
        if (e.keyCode == 13) {
            translate($search.val());
            $search.val('');
        }
    }

    function save() {
        $text.text($ta.val()).show();
        $ta.hide();
        $edit.show();
        $save.hide();
    }

    function translate(phrase) {
        // Combine accents into a single accented character, if necessary.
        // http://french.about.com/od/writing/ss/typeaccents_8.htm
        // http://www.javascripter.net/faq/accentedcharacters.htm
        // http://utf8-chartable.de/unicode-utf8-table.pl?start=767&number=128
        var TRANSFORM = [
            // Acute accent.
            [/E\u0301/g, "\xC9"], // É
            [/e\u0301/g, "\xE9"], // é

            // Grave accent.
            [/a\u0300/g, "\xE0"], // à
            [/e\u0300/g, "\xE8"], // è
            [/u\u0300/g, "\xF9"], // ù

            // Cedilla (no combining accent).

            // Circumflex.
            [/a\u0302/g, "\xE2"], // â
            [/e\u0302/g, "\xEA"], // ê
            [/i\u0302/g, "\xEE"], // î
            [/o\u0302/g, "\xF4"], // ô
            [/u\u0302/g, "\xFB"], // û

            // Trema.
            [/e\u0308/g, "\xEB"], // ë
            [/i\u0308/g, "\xEF"], // ï
            [/u\u0308/g, "\xFC"] // ü

            // oe ligature (no combining accent).
        ];
        for (var i = 0; i < TRANSFORM.length; i++)
            phrase = phrase.replace(TRANSFORM[i][0], TRANSFORM[i][1]);

        var url = 'http://glosbe.com/gapi/translate?callback=?';
        var data = { from: 'fra', dest: 'eng', format: 'json', phrase: phrase,
            callback: 'translationCallback', pretty: true };
        $.getJSON(url, data);
    }

    $('.save').click(save);
    $('.edit').click(edit);

    $('body').keydown(function(e) {
        if (e.keyCode == 32 && $text.is(':visible')) {
            e.preventDefault();
            translate(getSelection().toLowerCase());
        }
    });

    $search.keypress(lookup);
});