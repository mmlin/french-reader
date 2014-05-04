function translationCallback(data) {
    var $definitions = $('.definitions');
    var $d = $('<div class="definition">');

    var $phrase = $('<h2 class="phrase">');
    $phrase.text(data.phrase).appendTo($d);
    
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