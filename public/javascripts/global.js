var tweetListData = [];
var tweetListData2 = [];
var typet = 'ot';
var utilisateur = {};
var premiere_connexion = true;
var tablecontent_save;
var version = 'classique';
var Tweet_E = {};

$(document).ready(function () {

    $('.bar_positif').css('width,', '500px');

    window.ondragstart = function () { return false; }


    $('#btnAddKeyWord').on('click', addKeyWords);
    $('#btnRemoveKeyWords').on('click', removeKeyWords);
    $('#btnFichier').on('click', loadFichier);
    $('#btnGetTweets').on('click', getNewTweets);
    $('#btnShowLog').on('click', showlog);
    $('#btnSuppLog').on('click', supplog);
    $('#btnGenererCloud').on('click', reloadCloud);
    $('#btnCorrectAll').on('click', correctAll);
    $('#btnSuppAll').on('click', deleteAll);

    $('#btnGetTweetsMenu').on('click', showTweetsMenu);
    $('#btnGestion').on('click', showGestion);
    $('#btnLogMenu').on('click', showLogMenu);

    actionsSupp();

    $('#btnattente').on('click', showattente);
    $('#btnmesevals').on('click', populateTableMesEvals);
    $('#btnres').on('click', populateTableRes);
    $('#btnall').on('click', allTweets);
    $('#btncorbeille').on('click', signales);

    $('#tweetList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    $('#tweetList table tbody').on('click', 'td a.linkdeletetweet', deleteTweet);
    $('#tweetList table tbody').on('click', 'td a.recuperer_tweet', recuperer_tweet);
    $('#tweetList table tbody').on('click', 'td a.reloadcloud', reloadCloud);
    $('#tweetList table tbody').on('click', 'td.note div.btnevals button', changeNote);
    $('#OneTweetEval').on('click', 'button', changeNote);
    $('#tweetList table tbody').on('click', '#tweet_alert', tweet_alert);
    $('#OneTweetInfosL').on('click', '#tweet_alert', tweet_alert);
    $('#Version').on('click', change_version);


    $('#btnneu').on('click', showneu);
    $('#btnneg').on('click', showneg);
    $('#btnpos').on('click', showpos);

    $('#btnconnexion').on('click', connexion);
    $('#btninscription').on('click', inscription);

    $('.form').find('input, textarea').on('keyup blur focus', function (e) {

        var $this = $(this),
            label = $this.prev('label');

        if (e.type === 'keyup') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.addClass('active highlight');
            }
        } else if (e.type === 'blur') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.removeClass('highlight');
            }
        } else if (e.type === 'focus') {

            if ($this.val() === '') {
                label.removeClass('highlight');
            }
            else if ($this.val() !== '') {
                label.addClass('highlight');
            }
        }

    });

    $('.tab a').on('click', function (e) {

        e.preventDefault();

        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');

        target = $(this).attr('href');

        $('.tab-content > div').not(target).hide();

        $(target).fadeIn(600);

    });

    var estConnecte = JSON.parse(localStorage.getItem('estConnecte'));
    if (estConnecte) {
        connecte(estConnecte);

    }




});

function change_version() {
    $('#Version').html('Version ' + version)

    if (version === 'classique') {
        version = 'compacte';
        populateTable(typet);
    }
    else {
        version = 'classique';
        getOneTweet();
    }
}

function showattente(event) {
    if (version === 'compacte')
        populateTable('t');
    else
        getOneTweet();
}

function showpos(event) {
    typet = 'tp';
    populateTable(typet);
}
function showneg(event) {
    typet = 'tn';
    populateTable(typet);
}
function showneu(event) {
    typet = 'tneu';
    populateTable(typet);
}

function showTweetsMenu() {

    if (utilisateur.admin) {
        document.getElementById("gestion").style.display = "none";
        document.getElementById("logmenu").style.display = "none";

        if (document.getElementById("addKeyWords").style.display === "inline-block")
            document.getElementById("addKeyWords").style.display = "none";
        else
            document.getElementById("addKeyWords").style.display = "inline-block";
    }
    else
        alert('Nécessite un accès admin');


}




function showGestion() {

    if (utilisateur.admin) {
        document.getElementById("addKeyWords").style.display = "none";
        document.getElementById("logmenu").style.display = "none";

        if (document.getElementById("gestion").style.display === "inline-block")
            document.getElementById("gestion").style.display = "none";
        else
            document.getElementById("gestion").style.display = "inline-block";
    }
    else
        alert('Nécessite un accès admin');

}


function showlog(event) {
    event.preventDefault();

    if (utilisateur.admin) {
        if (document.getElementById("logbox").style.display === "inline") {
            document.getElementById("logbox").style.display = "none";
        }
        else {

            document.getElementById("logbox").style.display = "inline";
        }
    }
    else
        alert('Nécessite un accès admin');


}

function showLogMenu(event) {
    event.preventDefault();
    if (utilisateur.admin) {
        document.getElementById("gestion").style.display = "none";
        document.getElementById("addKeyWords").style.display = "none";

        if (document.getElementById("logmenu").style.display === "inline-block")
            document.getElementById("logmenu").style.display = "none";
        else
            document.getElementById("logmenu").style.display = "inline-block";
    }
    else
        alert('Nécessite un accès admin');


}


function supplog(event) {
    event.preventDefault();

    $.ajax({
        type: 'DELETE',
        url: '/tweets/supplog',
    }).done(function (response) {

        if (response.msg === '') {
            getLog();

        }
        else {

            alert('Error: ' + response.msg);
        }
    });

}



function actionsSupp() {
    var tableContent = '';
    nbl = getLog();

    $.getJSON('/tweets/keywords', function (data) {
        tweetListData = data;
        var tableContent2 = '';


        $.each(data, function () {

            tableContent2 = "<strong class='listKeyWords'> " + this.keyword + " </strong>";
            $("#addKeyWords").append(tableContent2);
        });

        $('#addKeyWords fieldset input').val('');
        $("#addKeyWords").append("<hr>");

    });
};


function getLog() {
    var tableContent = '';
    var nblog = 0;


    $.getJSON('/tweets/getlog', function (data) {

        $.each(data, function () {
            nblog++;
            if (this.log === "Suppression de tous les tweets") {
                tableContent += "<strong><font color='red'>" + this.log + "</font></strong>";

            }
            else if (this.log === "Récupération de tweets...") {
                tableContent += "<strong><font color='green'>" + this.log + "</font></strong>";
            }
            else if (this.log === "Nouveau WordCloud" || this.log === "Suppresion des mots-clés") {
                tableContent += "<strong><font color=#008CBA>" + this.log + "</font></strong>";
            }
            else
                tableContent += this.log;
            tableContent += "<br>";
        });


        $('#logbox').html(tableContent);
        document.getElementById('logbox').scrollTop = 1000000;
        $('#btnShowLog').html("Log (" + nblog + ")");


    });
    return nblog;

};







function note(tweet) {

    var tableContent = '<td class="note"><table class="tablenote" cellspacing="0" cellpadding="0">';

    if (typet === "me") {
        if (tweet['utilisateurs'][utilisateur.pseudo] === 'positif')
            tableContent += "<button id='btnevalue' cursor='default' class='btnbleumini' cursor='none'>Positif</button><br><br>";
        else if (tweet['utilisateurs'][utilisateur.pseudo] === 'negatif')
            tableContent += "<button id='btnevalue' class='btnrougemini' cursor='none'>Négatif</button><br><br>";
        else
            tableContent += "<button id='btnevalue' class='btngrismini' cursor='none'>Neutre</button><br><br>";
    }
    tableContent += '<div class="btnevals"><button data-tooltip="Vous jugez ce tweet positif ou plutôt positif" id="' + tweet.id_str + '" class="btnpositif" value="positif"> </button><button data-tooltip="Ni positif, ni négatif.       Sélectionnez cette option si vous n\'êtes pas certain." id="' + tweet.id_str + '" class="btnneutre" value="neutre"> </button><button data-tooltip="Vous jugez ce tweet négatif ou plutôt négatif" id="' + tweet.id_str + '" class="btnnegatif" value="negatif"> </button></div>';

    tableContent += "</table></td>";
    return tableContent;
}


// function btnreturn(tweet) {
//     tableContent = '';

//         tableContent = '<td><a href="#" id="' + tweet.user.screen_name + '" class="linkdeletetweet" rel="' + tweet._id + '"><button id="btnRemoveKeyWords">X</button></a></td>';

//     return tableContent;
// }



function btnsupp(tweet) {
    tableContent = '';
    if (utilisateur.admin && typet != 'ot')
        tableContent = '<td><a href="#" id="' + tweet.user.screen_name + '" class="linkdeletetweet" rel="' + tweet._id + '"><button id="btnRemoveKeyWords">X</button></a></td>';
    else if (typet === 't')
        tableContent = '<td class="alert"><a data-tooltip="Signalez ce tweet si vous jugez qu\'il ne contient pas d\'éléments permettant de l\'évaluer correctement.          Vous ne serez pas décompté d\'évaluations"> <img src="images/alert2.png" rel="' + tweet.id_str + '" id="tweet_alert"></img></a></td>';
    else if (typet === 'me' || typet === 'res')
        tableContent = '<td></td>'
    else {
        $('#OneTweetInfosL').html('<a data-tooltip="Signalez ce tweet si vous jugez qu\'il ne contient pas d\'éléments permettant de l\'évaluer correctement.          Vous ne serez pas décompté d\'évaluations"> <img src="images/alert2.png" rel="' + tweet.id_str + '" id="tweet_alert"></img></a>');
    }
    return tableContent;
}

function ajouter_nom(str, nom) {

    if (str != '')
        str += ", " + nom;
    else
        str += nom;

    return str;

}


function bar(tweet) {

    var pos_str = '';
    var neu_str = '';
    var neg_str = '';


    var length = Object.keys(tweet.utilisateurs).length;
    var positif = 0, neutre = 0, negatif = 0;

    var uti = tweet.utilisateurs;



    Object.keys(tweet.utilisateurs).forEach(function (key) {
        if (uti[key] === 'positif') {
            positif++;
            pos_str = ajouter_nom(pos_str, key);
        } else if (uti[key] === 'neutre') {
            neutre++;
            neu_str = ajouter_nom(neu_str, key);
        } else if (uti[key] === 'negatif') {
            negatif++;
            neg_str = ajouter_nom(neg_str, key);
        }
    });


    positif = (positif / length) * 100;
    var positif_s = positif.toString() + '%';
    negatif = (negatif / length) * 100;
    var negatif_s = negatif.toString() + '%';
    neutre = (neutre / length) * 100;
    var neutre_s = neutre.toString() + '%';


    var str = "#" + tweet.id_str;

    if (positif > 0) {
        $('button[id="' + tweet.id_str + '"][class="bar_positif"]').css('width', positif_s);
        $('button[id="' + tweet.id_str + '"][class="bar_positif"]').css('display', 'inline-block');
        $('button[id="' + tweet.id_str + '"][class="bar_positif"]').html(positif_s);
        $('button[id="' + tweet.id_str + '"][class="bar_positif"]').attr('data-tooltip', pos_str);

    }
    if (neutre > 0) {
        $('button[id="' + tweet.id_str + '"][class="bar_neutre"]').css('width', neutre_s);
        $('button[id="' + tweet.id_str + '"][class="bar_neutre"]').css('display', 'inline-block');
        $('button[id="' + tweet.id_str + '"][class="bar_neutre"]').html(neutre_s);
        $('button[id="' + tweet.id_str + '"][class="bar_neutre"]').attr('data-tooltip', neu_str);

    }
    if (negatif > 0) {
        $('button[id="' + tweet.id_str + '"][class="bar_negatif"]').css('width', negatif_s);
        $('button[id="' + tweet.id_str + '"][class="bar_negatif"]').css('display', 'inline-block');
        $('button[id="' + tweet.id_str + '"][class="bar_negatif"]').html(negatif_s);
        $('button[id="' + tweet.id_str + '"][class="bar_negatif"]').attr('data-tooltip', neg_str);


    }
}


function populateTableRes() {
    var tableContent = '';
    var nb = 0;

    $('#car').html('');
    $('#tweetList').css("display", "inline");
    $('#version_classique').css("display", "none");
    $('#Version').hide();

    $('.page').css("background-image", "url(/images/b7.png)");

    $('#tweetList table tbody').html(tableContent);
    // $('#mySpinner2').toggleClass('spinner2');
    $('#twitter_loading').css("display", "inline");


    $('#InfoBox').html("Cette page affiche tous les tweets et les évaluations de chacun des utilisateurs");
    $('#InfoBox').css("border-top", "20px solid #FF9800");

    $.getJSON('/tweets/res', function (data) {
        tweetListData2 = data;


        $.each(data, function () {

            nb++;
            tableContent += '<tr>';

            tableContent += '<td></td>';

            tableContent += '<td><button id="' + this.id_str + '" class="bar_positif""></button><button id="' + this.id_str + '" class="bar_neutre""></button><button id="' + this.id_str + '" class="bar_negatif""></button><a href="#" class="linkshowuser" rel="' + this.id_str + '">(' + this.evaluations + ')<br><button  class="btnvert">' + this.user.screen_name + '</button></a></td>';

            tableContent += '<td>' + this.tweet_complet + '</td>';

            tableContent += '<td></td>';

            tableContent += '</tr>';

            tableContent += '<tr class="version_reduite">';
            tableContent += '<td></td>';
            tableContent += '<td>Version réduite:</td>';
            tableContent += '<td>' + this.tweet_corrige + '</td>';
            tableContent += '<td class="deuxieme"></td>';
            tableContent += '</tr>';
            
            $('#tweetList table tbody').append(tableContent);
            bar(this);

            // $('.bar_positif').css( 'width','75%' );

            tableContent = '';

        });


        $('#listeTweets').replaceWith("<h2 id='listeTweets'>Tweets - résultats (" + nb + ")</h2>");
        document.getElementById("tweetList").style.display = "inline";

        // $('#tweetList table tbody').html(tableContent);
        $('#mySpinner2').removeClass('spinner2');
        $('#twitter_loading').css("display", "none");
        $('#afficher_version_reduite').on('click', toggle_version_reduite);


    });
    getLog();

    // $('#mySpinner').removeClass('spinner');

    typet = "res";

    $('#afficher_version_reduite').on('click', toggle_version_reduite);

}


function getOneTweet() {


    $('#twitter_loading').css("display", "none");
    $('#InfoBox').html("Ci-dessous un tweet que vous pouvez évaluer positif, neutre ou négatif.<br>Si vous n'êtes pas sûr ou si il vous paraît être objectif, évaluez-le neutre.<br>Si le tweet ne contient aucun ou trop peu d'éléments pour son évaluation, si il n'a pas été entièrement rédigé en anglais ou si il ne s'affiche pas, veuillez le signaler.<br><br>Votre nombre d'évaluations est limité et vous devrez en utiliser au moins 20 pour accéder aux résultats.<br>Les tweets sont séléctionnés aléatoirement sur le seul critère que vous ne l'ayez pas déjà évalué.<br><br>Si le tweet est une réponse à un autre, attention à ne pas les confondre. Le tweet à évaluer sera toujours en dessous de l'autre.");
    $('#InfoBox').css("border-top", "20px solid #009688");
    $('#userInfo').css('display', 'none');
    typet = 'ot';

    $('.page').css("background-image", "url(/images/twitter_big.png)");
    $('#tweetList').css("display", "none");
    $('#version_classique').css("display", "inline");
    $('#Version').show();


    if (utilisateur.evaluations_restantes <= 0) {
        $('#OneTweetEval').html('<span align="center">Merci pour votre aide!<br><br>Vous ne pouvez plus évaluer de tweets pour le moment</span>');
        $('#twitter_purple').css("display", "none");
        $('#OneTweet').toggle();
        return;
    }

    var tableContent = '';
    var tableContentEval = '';
    $('#twitter_purple').css("display", "inline");


    $.getJSON('/tweets/getOneTweet/' + utilisateur.pseudo, function (Tweet) {
        Tweet = Tweet[0];
        Tweet_E = Tweet;

        tableContent += '<div id="OneTweetContent"><blockquote class="twitter-tweet" data-lang="fr"><p lang="en" dir="ltr"><a href="https://twitter.com/A/status/' + Tweet.id_str + '"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></div><br>';

        tableContentEval += "<button data-tooltip='Vous jugez ce tweet positif ou plutôt positif' id='" + Tweet.id_str + "' class='btnbleuminiOT' value='positif'>Positif</button>";
        tableContentEval += "<button data-tooltip='Ni positif, ni négatif.       Sélectionnez cette option si vous n'êtes pas certain.' id='" + Tweet.id_str + "' class='btngrisminiOT' value='neutre'>Neutre</button>";
        tableContentEval += "<button data-tooltip='Vous jugez ce tweet négatif ou plutôt négatif' id='" + Tweet.id_str + "' class='btnrougeminiOT' value='negatif'>Négatif</button>";

        // tableContent += '<div class="btnevals"><button data-tooltip="Vous jugez ce tweet positif ou plutôt positif" id="' + tweet.id_str + '" class="btnpositif" value="positif"> </button><button data-tooltip="Ni positif, ni négatif.       Sélectionnez cette option si vous n\'êtes pas certain." id="' + tweet.id_str + '" class="btnneutre" value="neutre"> </button><button data-tooltip="Vous jugez ce tweet négatif ou plutôt négatif" id="' + tweet.id_str + '" class="btnnegatif" value="negatif"> </button></div>';


        // if (typet === "me") {
        //     if (tweet['utilisateurs'][utilisateur.pseudo] === 'positif')
        //         tableContent += "<button id='btnevalue' cursor='default' class='btnbleumini' cursor='none'>Positif</button><br><br>";
        //     else if (tweet['utilisateurs'][utilisateur.pseudo] === 'negatif')
        //         tableContent += "<button id='btnevalue' class='btnrougemini' cursor='none'>Négatif</button><br><br>";
        //     else
        //         tableContent += "<button id='btnevalue' class='btngrismini' cursor='none'>Neutre</button><br><br>";
        // }

        // tableContent += note(Tweet);

        // $('#mySpinner2').removeClass('spinner2');

        // $('#listeTweets').replaceWith("<h2 id='listeTweets'>Liste des Tweets en attente (" + nb + ")</h2>");
        // typet = "t";

        btnsupp(Tweet);
        $('#OneTweet').html(tableContent);
        $('#OneTweetEval').html(tableContentEval);
        $('#OneTweetContent').toggle();
        $('#OneTweetEval').toggle();

        $('#listeTweets').replaceWith("<h2 id='listeTweets'>Liste des Tweets en attente d'évaluation (" + utilisateur.evaluations_restantes + ")</h2>");

    });
    getLog();


    $('#afficher_version_reduite').on('click', toggle_version_reduite);

    setTimeout(() => {
        $('#OneTweetContent').css("display", "inline");
        $('#OneTweetEval').toggle();
        $('#twitter_purple').css("display", "none");

        document.body.scrollTop = document.body.scrollHeight;

    }, 1111);

    // $('#OneTweetContent').css("margin-left", "100px");


}


function allTweets() {

    var tableContent = '';
    var nb = 0;
    $('#car').html('');
    $('#version_classique').css("display", "none");
    $('#tweetList').css("display", "inline");
    $('.page').css("background-image", "url(/images/b7.png)");

    if (typet != 'a') {
        $('#tweetList table tbody').html(tableContent);
        // $('#mySpinner2').toggleClass('spinner2');
        $('#twitter_loading').css("display", "inline");

    }
    typet = 'a';

    $('#InfoBox').html("-");
    $('#InfoBox').css("border-top", "20px solid #009688");



    $.getJSON('/tweets/alltweets', function (data) {
        tweetListData2 = data;

        $.each(data, function () {

            nb++;
            tableContent += '<tr>';
            tableContent += btnsupp(this);
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.id_str + '"> <button data-tooltip="Afficher des informations supplémentaires sur l\'auteur de ce tweet" class="btnvert">' + this.user.screen_name + '</button></a></td>';
            tableContent += '<td>' + this.tweet_complet + '</td>';

            tableContent += '<td></td>';

            tableContent += '</tr>';

            tableContent += '<tr class="version_reduite">';
            tableContent += '<td></td>';
            tableContent += '<td>Version réduite:</td>';
            tableContent += '<td class="tweet_corrige">' + this.tweet_corrige + '</td>';
            tableContent += '<td></td>';
            tableContent += '<td></td>';

            tableContent += '<td class="deuxieme"></td>';
            tableContent += '</tr>';
        });

        $('#listeTweets').replaceWith("<h2 id='listeTweets'>Liste de tous les tweets (" + nb + ")</h2>");
        typet = "a";
        $('#tweetList table tbody').html(tableContent);
        $('#twitter_loading').css("display", "none");


    });
    getLog();
    $('.afficher_version_reduite').on('click', toggle_version_reduite);
}




function signales() {

    var tableContent = '';
    var nb = 0;
    $('#car').html('');
    $('#version_classique').css("display", "none");
    $('#tweetList').css("display", "inline");
    $('.page').css("background-image", "url(/images/b7.png)");

    if (typet != 's') {
        $('#tweetList table tbody').html(tableContent);
        // $('#mySpinner2').toggleClass('spinner2');
        $('#twitter_loading').css("display", "inline");

    }
    typet = 's';

    $('#InfoBox').html("Tweets signalés");
    $('#InfoBox').css("border-top", "20px solid #009688");



    $.getJSON('/tweets/signales', function (data) {
        tweetListData2 = data;

        $.each(data, function () {

            nb++;
            tableContent += '<tr>';
            tableContent += '<td><a href="#" id="' + this.user.screen_name + '" class="recuperer_tweet" rel="' + this.id_str + '"><button id="btnviolet" class="btnviolet">Récupérer</button></a></td>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.id_str + '"> <button data-tooltip="Afficher des informations supplémentaires sur l\'auteur de ce tweet" class="btnvert">' + this.user.screen_name + '</button></a></td>';
            tableContent += '<td>' + this.tweet_complet + '</td>';

            tableContent += '<td></td>';

            tableContent += '</tr>';

            tableContent += '<tr class="version_reduite">';
            tableContent += '<td></td>';
            tableContent += '<td>Version réduite:</td>';
            tableContent += '<td class="tweet_corrige">' + this.tweet_corrige + '</td>';
            tableContent += '<td></td>';
            tableContent += '<td></td>';

            tableContent += '<td class="deuxieme"></td>';
            tableContent += '</tr>';
        });

        $('#listeTweets').replaceWith("<h2 id='listeTweets'>Liste des tweets signalés (" + nb + ")</h2>");
        typet = "s";
        $('#tweetList table tbody').html(tableContent);
        $('#twitter_loading').css("display", "none");


    });
    getLog();
    $('.afficher_version_reduite').on('click', toggle_version_reduite);
}





function populateTable(tw) {

    var tableContent = '';
    var nb = 0;
    $('#car').html('Evaluation');
    $('#version_classique').css("display", "none");
    $('#tweetList').css("display", "inline");
    $('.page').css("background-image", "url(/images/b7.png)");

    if (typet != 't') {
        $('#tweetList table tbody').html(tableContent);
        // $('#mySpinner2').toggleClass('spinner2');
        $('#twitter_loading').css("display", "inline");

    }
    typet = 't';

    $('#InfoBox').html("Cette page affiche un nombre de tweets correspondant à vos évaluations restantes.<br>En tant qu'utilisateur, vous pouvez utiliser ces évaluations pour juger chacun des tweets positifs, négatifs ou neutre.<br>Utilisez toutes vos évaluations pour accéder ensuite aux résultats !<br>Chacun des tweets ci-dessous a été sélectionné aléatoirement sur le seul critère que vous ne l'ayez pas déjà évalué.");
    $('#InfoBox').css("border-top", "20px solid #009688");



    $.getJSON('/tweets/t/t/' + utilisateur.evaluations_restantes + '/' + utilisateur.pseudo, function (data) {
        tweetListData2 = data;

        if (premiere_connexion) {
            tweetListData = data;
            premiere_connexion = false;
        }
        else {
            data = tweetListData;
            tweetListData2 = data;
        }


        $.each(data, function () {
            nb++;
            tableContent += '<tr>';
            tableContent += btnsupp(this);
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.id_str + '"> <button data-tooltip="Afficher des informations supplémentaires sur l\'auteur de ce tweet" class="btnvert">' + this.user.screen_name + '</button></a></td>';
            tableContent += '<td>' + this.tweet_complet + '</td>';
            tableContent += note(this);
            tableContent += '</tr>';

            tableContent += '<tr class="version_reduite">';
            tableContent += '<td></td>';
            tableContent += '<td>Version réduite:</td>';
            tableContent += '<td class="tweet_corrige">' + this.tweet_corrige + '</td>';
            tableContent += '<td></td>';
            tableContent += '<td></td>';
            tableContent += '<td class="deuxieme"></td>';
            tableContent += '</tr>';
        });

        $('#listeTweets').replaceWith("<h2 id='listeTweets'>Liste des Tweets en attente (" + nb + ")</h2>");
        typet = "t";
        $('#tweetList table tbody').html(tableContent);
        $('#twitter_loading').css("display", "none");


    });
    getLog();
    $('.afficher_version_reduite').on('click', toggle_version_reduite);
};

function toggle_version_reduite() {
    $('.version_reduite').toggle();
}



function populateTableMesEvals() {
    var tableContent = '';
    var nb = 0;
    $('#car').html('Evaluation');
    $('#tweetList').css("display", "inline");
    $('#version_classique').css("display", "none");
    $('.page').css("background-image", "url(/images/b7.png)");
    $('#Version').hide();

    // $('#mySpinner2').toggleClass('spinner2');
    $('#twitter_loading').css("display", "inline");

    var changement_page = true;
    if (typet === "me")
        changement_page = false;
    typet = "me";

    if (changement_page)
        $('#tweetList table tbody').html(tableContent);


    $('#InfoBox').html("Cette liste regroupe tous les tweets que vous avez déjà évalué.<br><br>En cas d'erreur, vous pouvez modifier votre évaluation.");
    $('#InfoBox').css("border-top", "20px solid #008CBA");

    $.getJSON('/tweets/mesevals/' + utilisateur.pseudo, function (data) {
        tweetListData2 = data;
        $.each(data, function () {

            nb++;
            tableContent += '<tr>';

            tableContent += btnsupp(this);
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.id_str + '"> <button data-tooltip="Afficher des informations supplémentaires sur l\'auteur de ce tweet" class="btnvert">' + this.user.screen_name + '</button></a></td>';
            tableContent += '<td>' + this.tweet_complet + '</td>';

            tableContent += note(this);

            tableContent += '</tr>';

            tableContent += '</tr>';
            tableContent += '<tr class="version_reduite">';
            tableContent += '<td></td>';
            tableContent += '<td>Version réduite:</td>';
            tableContent += '<td class="tweet_corrige">' + this.tweet_corrige + '</td>';
            tableContent += '<td></td>';
            tableContent += '<td></td>';
            tableContent += '<td class="deuxieme"></td>';
            tableContent += '</tr>';
        });

        // $('#mySpinner2').removeClass('spinner2');
        $('#twitter_loading').css("display", "none");

        $('#listeTweets').replaceWith("<h2 id='listeTweets'>Liste des tweets évalués (" + nb + ")</h2>");

        $('#tweetList table tbody').html(tableContent);

    });
    getLog();

    // $('#mySpinner').removeClass('spinner');


};

function deconnexion(event) {
    event.preventDefault();

    localStorage.setItem('estConnecte', null);
    location.reload();

};


function connecte(user) {
    utilisateur = user;

    document.getElementById("boiteadministration").style.display = "inline";

    $('#connecte').html("<button data-tooltip='Cette action vous déconnectera' id='deconnexion'>Déconnexion</button><span id='connectetexte'>Vous êtes connecté en tant que " + user.pseudo + "</span><br><br><span id='evaluations_restantes'>Il vous reste " + utilisateur.evaluations_restantes + " tweets à évaluer</span><br><span id='afficher_version_reduite'>Afficher/cacher versions réduites</span>");

    $('#deconnexion').on('click', deconnexion);
    $('#Version').html('Version compacte');

    // populateTable('t');
    // change_version();

    if (version === 'compacte') {
        typet = 't';
        populateTable(typet);
    } else {
        typet = 'ot';
        getOneTweet();
    }

    localStorage.setItem('estConnecte', JSON.stringify(user));

    document.getElementById("connexioninscription").style.display = "none";
    document.getElementById("javapage").style.display = "inline";
    document.getElementById("formAddUser").style.display = "none";
    document.getElementById("formConnexion").style.display = "none";
    // document.getElementById("boiteadministration").style.display = "inline";

    if (utilisateur.evaluations_restantes === 0) {
        utilisateur.acces_resultats = true;
    }


}



function connexion(event) {
    event.preventDefault();



    var errorCount = 0;
    $('#login input').each(function (index, val) {
        if ($(this).val() === '') { errorCount++; }
    });
    if (errorCount === 0) {
        $('#mySpinner').toggleClass('spinner');

        var pseudo = {
            'pseudo': $('#login #loginUserName').val(),
            'password': $('#login #loginUserPassword').val(),
        };
        // alert(pseudo);
        $.ajax({
            type: 'POST',
            data: pseudo,
            url: '/tweets/connexion',
            dataType: 'JSON'
        }).done(function (response) {
            if (response.pseudo) {
                // alert(response.admin);
                $('#mySpinner').toggleClass('spinner');

                setTimeout(function () {

                    connecte(response);
                    // utilisateur = $('#loginUserName').val();
                    // alert(utilisateur);

                }, 500);


            }
            else {

                alert('Erreur: ' + response.msg);

                setTimeout(function () {

                    $('#mySpinner').toggleClass('spinner');
                    // utilisateur = $('#loginUserName').val();
                    // alert(utilisateur);

                }, 500);
            }
        });
    }
    else {
        alert('Veuillez remplir tous les champs');
        // return false;
    }

};

function inscrit() {


}



function inscription(event) {

    event.preventDefault();


    var errorCount = 0;
    pseudo = $('#signup #inputUserName').val();
    email = $('#signup #inputUserEmail').val();
    password = $('#signup #inputUserPassword').val();
    // alert(pseudo+email);
    if (pseudo === '' || email === '' || password === '') {
        errorCount++;
    }
    if (errorCount === 0) {

        var data = {
            'pseudo': $('#signup #inputUserName').val(),
            'email': $('#signup #inputUserEmail').val(),
            'password': $('#signup #inputUserPassword').val(),
        };
        $.ajax({
            type: 'POST',
            data: data,
            url: '/tweets/adduser',
            dataType: 'JSON'
        }).done(function (response) {

            if (response.pseudo) {

                // utilisateur = $('#formAddUser #inputUserName').val();
                alert('Inscription terminée.  Vous êtes connecté en tant que ' + response.pseudo);
                connecte(response);
            }
            else if (response.msg === 500) {

                alert(pseudo + ' est déjà pris');
            }
        });
    }
    else {
        alert('Tous les champs sont obligatoires!');
        return false;
    }


}



function addKeyWords(event) {
    event.preventDefault();


    var errorCount = 0;
    $('#addKeyWords input').each(function (index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    if (errorCount === 0) {

        var newKey = {
            'keyword': $('#addKeyWords fieldset input#inputKeyWord').val(),
        }
        $.ajax({
            type: 'POST',
            data: newKey,
            url: '/tweets/addkeywords',
            dataType: 'JSON'
        }).done(function (response) {

            if (response.msg === '') {

                motcle = $('#addKeyWords fieldset input#inputKeyWord').val();

                var txt1 = "<strong class='listKeyWords'>" + motcle + "  </strong>";
                addLog("Ajout du mot clé " + motcle);
                $("#addKeyWords").append(txt1);
                $('#addKeyWords fieldset input').val('');
                getLog();

            }
            else {

                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        alert('A remplir');
        return false;
    }

};






function removeKeyWords(event) {
    event.preventDefault();
    $('.listKeyWords').remove();

    $.ajax({
        type: 'DELETE',
        url: '/tweets/removekeywords',
    }).done(function (response) {

        if (response.msg === '') {
        }
        else {

            alert('Error: ' + response.msg);
        }
    });
    addLog("Suppression des mots-clés");
    getLog();

};

function loadFichier(event) {
    event.preventDefault();
    $('body').load("word.py");
    function load_home() {
        document.getElementById("content").innerHTML = '<object type="text/html" data="home.html" ></object>';
    }

};

function count() {


    $.ajax({
        type: 'GET',
        url: '/tweets/count',
    }).done(function (response) {
        return response.msg;
        if (response.msg === '') {

            // alert("ok")
        }
        else {

            alert('Error: ' + response.msg);
        }
    });
};

function addLog(logtext) {

    var logtext = {
        'log': logtext,
    };
    $.ajax({
        type: 'POST',
        data: logtext,
        url: '/tweets/addlog',
        dataType: 'JSON'
    }).done(function (response) {

        if (response.msg === '') {

            // alert("ok")
        }
        else {

            alert('Error: ' + response.msg);
        }
    });
};



function tweet_alert() {

    var thisID = $(this).attr('rel');

    var arrayPosition = tweetListData.map(function (arrayItem) { return arrayItem.id_str; }).indexOf(thisID);
    var thisUserObject = tweetListData[arrayPosition];

    $.ajax({
        type: 'POST',
        url: '/tweets/alert/' + $(this).attr('rel'),
        dataType: 'JSON'
    }).done(function (response) {

        if (response.msg === '') {
            if (typet === 'ot') {
                $('#Notifications p').html('Tweet de ' + Tweet_E.user.screen_name + ' signalé ');
            }
            else
                $('#Notifications p').html('Tweet de ' + thisUserObject.user.screen_name + ' signalé ');
            $('#Notifications').css('opacity', 1);

            setTimeout(() => {
                $('#Notifications').css('opacity', 0);

            }, 2500);

            if (typet === 't')
                tweetListData.splice(arrayPosition, 1);

            var length = Object.keys(tweetListData).length;


            if (length === 0 && typet === 't') {
                premiere_connexion = true;
                if (utilisateur.evaluations_restantes === 0) {
                    utilisateur.acces_resultats = true;
                }
            }

            if (typet === 't')
                populateTable(typet);
            else
                getOneTweet();
        }
        else
            alert("Erreur: " + response.err);

    })

};



function changeNote(event) {


    var dec = false;
    // Selon
    if (typet === 't' || typet === 'ot')
        dec = true;
    var thisID = $(this).attr('id');
    $(this).attr('disabled', 'disabled');
    var pos = $(this).attr('value');

    var arrayPosition = tweetListData.map(function (arrayItem) { return arrayItem.id_str; }).indexOf(thisID);
    var thisUserObject = tweetListData[arrayPosition];

    if (typet === 'me') {
        arrayPosition = tweetListData2.map(function (arrayItem) { return arrayItem.id_str; }).indexOf(thisID);
        thisUserObject = tweetListData2[arrayPosition];
    }
    else if (typet === 'ot') {
        thisUserObject = Tweet_E;
    }

    $.ajax({
        type: 'POST',
        url: '/tweets/changenote/' + thisID + '/' + utilisateur.pseudo + '/' + $(this).attr('value') + '/' + dec,
        dataType: 'JSON'
    }).done(function (response) {
        if (response.msg === '') {

            if (typet === 't' || typet === 'ot') {
                utilisateur['evaluations_restantes']--;
                localStorage.setItem('estConnecte', JSON.stringify(utilisateur));
                $('#evaluations_restantes').html("Il vous reste " + utilisateur.evaluations_restantes + " tweets à évaluer");
            }

            if (typet === 't' || typet === 'ot')
                $('#Notifications p').html('Tweet de ' + thisUserObject.user.screen_name + ' évalué ' + pos);
            else if (typet === 'me')
                $('#Notifications p').html('Evaluation modifiée');

            $('#Notifications').css('opacity', 1);

            setTimeout(() => {
                $('#Notifications').css('opacity', 0);

            }, 2500);

            if (typet === 't')
                tweetListData.splice(arrayPosition, 1);

            var length = Object.keys(tweetListData).length;
            if (length === 0 && typet === 't') {
                premiere_connexion = false;
                if (utilisateur.evaluations_restantes === 0) {
                    utilisateur.acces_resultats = true;
                }
            }
            if (typet === 't')
                populateTable(typet);
            else if (typet === 'me') {
                populateTableMesEvals();
            } else
                getOneTweet();
        }
        else {
            alert('Erreur: ' + response.msg);
        }
    });

}



function showUserInfo(event) {
    event.preventDefault();

    // document.getElementById("logbox").style.display = "none";
    // document.getElementsByClassName("infos").style.display = "inline";

    var thisUserID = $(this).attr('rel');

    var arrayPosition = tweetListData2.map(function (arrayItem) { return arrayItem.id_str; }).indexOf(thisUserID);
    var thisUserObject = tweetListData2[arrayPosition];
    $('#userInfo').css('display', 'inline');


    // alert(thisUserObject);
    // alert(tweetListData[0]);


    cite = "Non";
    if (thisUserObject.is_quote_status === true) {
        if (thisUserObject.is_quote_status.truncated === true) {
            cite = thisUserObject.quoted_status.extended_tweet.full_text;
        }
        else {
            cite = thisUserObject.quoted_status.text;
        }
    }


    var obj = document.getElementById("imageprofil");
    var src = obj.src;
    var pos = src.indexOf('?');
    if (pos >= 0) {
        src = src.substr(0, pos);
    }
    var date = new Date();
    obj.src = thisUserObject.user.profile_image_url_https;
    $('#linkcloud').replaceWith('<td class="linkcloud" id="linkcloud"><a href="#" class="reloadcloud"><button id="btnvert">Générer</button></a></td>');



    $('#userInfoName').text(thisUserObject.user.name);
    $('#userInfoDescription').text(thisUserObject.user.description);
    $('#userInfoCite').text(cite);
    $('#userInfoCree').text(thisUserObject.created_at);
    $('#userInfoVille').text(thisUserObject.user.location);





};




function correctAll(event) {

    event.preventDefault();
    $('#btnCorrectAll').text("Tokenisation...");
    $.ajax({
        type: 'GET',
        url: '/tweets/correction/' + typet
    }).done(function (response) {

        if (response.msg === '') {
        }
        else {
            alert('Error: ' + response.msg);
        }
    });


    setTimeout(function () {
        populateTable(typet);
        $('#btnCorrectAll').text("Tokenisé");
        setTimeout(function () {
            $('#btnCorrectAll').replaceWith('<button class="btnvert" id="btnCorrectAll">Re-Tokeniser</button>');
        }
            , 1200);
    }
        , 3200);
};



function getNewTweets(event) {

    event.preventDefault();
    $('#getnewtweets').text("Récupération...");

    $('#mySpinner').toggleClass('spinner');


    $.ajax({
        type: 'GET',
        url: '/tweets/getnewtweets/' + typet
    }).done(function (response) {
        if (response.msg === '') {

            // setInterval(function () {
            //     populateTable(typet);
            // }
            //     , 2500);
            setTimeout(function () {
                $('#getnewtweets').replaceWith('<td><button id="btntrans">Récupérés</button></td>');
                $('#mySpinner').removeClass('spinner');

            }
                , 4000);

        }
        else {
            alert('Error: ' + response.msg);
        }
    });
    addLog("Récupération de tweets...");



};


function deleteAll(event) {

    event.preventDefault();
    var confirmation = confirm('Tout supprimer ?');


    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/tweets/deleteall/t/' + utilisateur.pseudo
        }).done(function (response) {

            if (response.msg === '') {
                populateTable(typet);
                return;
            }
            else {
                alert('Error: ' + response.msg);
            }
        });

    }
    else {
        return false;
    }
    addLog("Suppression de tous les tweets");


};


function reloadCloud(event) {

    event.preventDefault();
    $('#btnGenererCloud').text("Génération d'un nouveau wordcloud....");
    if (true === true) {
        $.ajax({
            type: 'GET',
            url: '/tweets/reload'
        }).done(function (response) {

            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
        addLog("Nouveau WordCloud");

    }
    else {
        return false;
    }
    // reloadImg('cloud');
    // $('#btnGenererCloud').replaceWith('<a href="#" class="reloadcloud"><button class="btntrans" id="btnGenererCloud">Génération...</button></a>');

    // setTimeout(function () {
    //     $('#btnGenererCloud').replaceWith('<a href="#" class="reloadcloud"><button class="btnbleu" id="btnGenererCloud">Générer WordCloud</button></a>');
    // }, 4666);
};





function reloadImg(id) {
    setTimeout(function () {
        var obj = document.getElementById(id);
        var src = obj.src;
        var pos = src.indexOf('?');
        if (pos >= 0) {
            src = src.substr(0, pos);
        }
        var date = new Date();
        obj.src = src + '?v=' + date.getTime();

    }, 3555);
    return false;
}


function deleteTweet(event) {

    event.preventDefault();

    var confirmation = confirm('Supprimer définitivement de la base de données?');



    var thisUserName = $(this).attr('rel');
    var arrayPosition = tweetListData2.map(function (arrayItem) { return arrayItem._id; }).indexOf(thisUserName);
    var arrayPosition2 = tweetListData.map(function (arrayItem) { return arrayItem._id; }).indexOf(thisUserName);
    var thisUserObject = tweetListData2[arrayPosition];

    typetweet = '/tweets/delete' + typet + '/';

    if (confirmation === true) {

        $.ajax({
            type: 'DELETE',
            url: 'tweets/deletet/' + typet + '/' + $(this).attr('rel')
        }).done(function (response) {


            if (response.msg === '') {
                // tweetListData2.splice(arrayPosition, 1);
                addLog("Suppression du tweet de " + thisUserObject.user.screen_name);
            }
            else {
                alert('Error: ' + response.msg);
            }

            if (typet === 't')
                tweetListData.splice(arrayPosition2, 1);
            else if (typet === 'a')
                allTweets(typet);
            else if (typet === 'me')
                return populateTableMesEvals();

        });
    }
    else {
        return false;

    }

};





function recuperer_tweet(event) {

    event.preventDefault();

    var confirmation = confirm('Récupérer ce tweet ?');

    var thisID = $(this).attr('rel');
    var arrayPosition = tweetListData2.map(function (arrayItem) { return arrayItem.id_str; }).indexOf(thisID);
    var thisUserObject = tweetListData2[arrayPosition];


    if (confirmation === true) {

        $.ajax({
            type: 'POST',
            url: 'tweets/recuperer/' + thisID
        }).done(function (response) {
            if (response.msg === '') {
                tweetListData2.splice(arrayPosition, 1);

                addLog("Récupération du tweet de " + thisUserObject.user.screen_name);
            }
            else {
                alert('Error: ' + response.msg);
            }

            // tweetListData.splice(arrayPosition2, 1);
            // populateTable(typet);
            signales();

        });
    }
    else {
        return false;

    }

};

