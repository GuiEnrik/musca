
function chamaBusca(){
    var nomeMusica = document.getElementById('q').value;

    if(document.getElementById('q').value !== ""){
        buscar(nomeMusica);
    }
}

function buscar(nomeMusica) {
    $.getJSON("http://api.vagalume.com.br/search.mus?apikey=fb9776bc5ceda4f7070f308d61954cff&q="+nomeMusica+"&limit=10", function(data){ 
            $(".media-list").empty();//limpa aresentacao de resultados
            cont_lim = 0;//contador para limite de musicas a apresentar
            var limite = 3;//quantidade de musicas a apresentar
            var cont_result = 0;
            var array_resultados = data.response.docs;
            var qtd_resultados = array_resultados.length;
            while((cont_result < qtd_resultados)&&(cont_lim < limite)){
                id_mus = array_resultados[cont_result]["id"];

                id_mus = id_mus.substr(1,id_mus.length-1);
                titulo_mus = array_resultados[cont_result]["title"];
                artista = array_resultados[cont_result]["band"];

                str = array_resultados[cont_result]["url"];
                arr = str.split("/");
                artistaURL = arr[1];

                //alert("Resultado Nº:" +cont_result+", "+id_mus+", "+titulo_mus+", "+artista+", "+artistaURL);
                varreAlbum(id_mus,titulo_mus);
                cont_result++;
            }
    });
}

function varreAlbum(id_mus_res,titulo_mus_res){
        //alert("oi");
        $.getJSON("https://www.vagalume.com.br/"+artistaURL+"/discografia/index.js", function(data){
            encontrado = false;
            var cont_album = 0;
            var cont_faixa = 0;
            var array_albuns = data.discography.item;
            var qtd_albuns = array_albuns.length;
            //alert("Quantidade de albums de "+data.discography.artist.desc+": "+qtd_albuns);
            while((qtd_albuns > 0) && (cont_album < qtd_albuns) && (encontrado===false)){
                nome_artista= data.discography.artist.desc;
                titulo_album = array_albuns[cont_album]["desc"];
                capa_album = array_albuns[cont_album]["cover"];
                //var estudio_album = array_albuns[cont_album]["label"];
                ano_album = array_albuns[cont_album]["published"];
                qtd_faixas = array_albuns[cont_album]["discs"][0].length;
                
                //alert("Quantidade de faixas: "+qtd_faixas);
                //alert(id_mus_res);
                while((cont_faixa < qtd_faixas) && (encontrado===false)){
                    //alert("Album: "+cont_album+" Faixa: "+cont_faixa);
                    if(id_mus_res === array_albuns[cont_album]["discs"][0][cont_faixa]["id"]){
                        encontrado = true;
                        cont_lim++;
                        mostraItem(titulo_mus_res,nome_artista,titulo_album,capa_album,ano_album,buscaMidia(titulo_mus_res, nome_artista));
                    }
                cont_faixa++;
                //alert(cont_lim);
                }
            cont_faixa = 0;
            cont_album++;
            }
        });
}


function buscaMidia(titulo_mus_enc,nome_artista_enc){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://www.googleapis.com/youtube/v3/search?part=id&maxResults=1&q="+titulo_mus_enc+" "+nome_artista_enc+"&type=video&fields=items%2Fid&key=AIzaSyDJrul_UykQdbO_qmJHJ0kfBMScTc3tEQ0",
        async: false,
        success: function (data) {
        idVideo = data.items[0].id.videoId;
        }
    });
    return idVideo;
}

function mostraItem(titulo_mus_enc,nome_artista_enc,titulo_album_enc,capa_album_enc,ano_album_enc,id_yt_mus_enc){
    //alert(titulo_album+", "+capa_album+", "+ano_album);
    var info='<div class="media">';
    info +=     '<div class="media-left" href="#"><img class="media-object" id="capa_disco" src="http://vagalume.com/' + capa_album_enc + '" height="64" width="64"></div>';
    info +=         '<div class="media-body">';
    info +=               '<h4 class="media-heading">'+titulo_mus_enc+'</h4>';
    info +=               '<p>por '+nome_artista_enc+'<br>'+titulo_album_enc+' ('+ano_album_enc+')</p>';
    info +=         '</div>';
    info +=     '<div class="media-right"><a target="iframeDown" href="https://www.youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v='+id_yt_mus_enc+'&title='+nome_artista_enc+' - '+titulo_mus_enc+'"><span class="glyphicon glyphicon-download-alt"></span></a></div>';
    info +=  '</div>';
    $(".media-list").append(info);
}