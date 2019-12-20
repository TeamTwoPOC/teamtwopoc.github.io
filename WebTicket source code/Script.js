function openEventStart(d){
    addLog("Выбор сеанса");
    cl('ppppppp' ,d);
    if(d.error){
        $.confirm({'title':'Ошибка', 'message':d.error});
        return;
    }
    $obj = $('.halls');
    $obj.html('');
    var levels = d['r'];
    var prices = [];
    $('.hallname').html(d['hallname']);
    for(var i in d['p']){
        var arr = d['p'][i];
        if(!prices[ arr['id'] ])
            prices[ arr['id'] ] = [];

        if(!prices[ arr['id'] ] [ arr['sort']])
            prices[ arr['id'] ] [ arr['sort'] ] = [];

        prices[ arr['id'] ][ arr['sort'] ][ arr['tid'] ] = arr;
    }
    var sids = [];
    cl('prices', prices);
    var sum  = 0;
    var min  = 0;

    var nconfig = {
        allow_single_deselect:true,
        no_results_text: 'Не найдено. <a href="#null" onclick="new_trainer_form(this)" style="color:#000080">ДОБАВИТЬ?</a>',
        placeholder_text_multiple: 'Выберите значения из списка',
        placeholder_text_single: 'Выберите значение из списка',

    };

    for(var i in levels){
        sids.push(levels[i]['sid']);
        sum += parseInt(levels[i]['tq_free']);
        if(parseInt(levels[i]['tq_free']) < min || !min)
            min = parseInt(levels[i]['tq_free']);
    }
    $form = $('<form id="reserveForm">');
    if(d.events_type_id == 4 || d.events_type_id == 2){

        if(0==1 && d.trainersList){
            var $sel = $('<select name="trainer_id[]">').css({width: '150px'});

            for(var j in d['trainersList']){
                var inc = d['trainersList'][j];
                $sel.append('<option value="'+inc['id']+'">Имя'+inc['fio']+'</option>');
            }

            $sel.appendTo($form).chosen(nconfig);
            $form.append('<img onclick="trainer_setups(this)" width="16" height="16" title="Параметры" />');

        }


        cl('sids', sids);
        $('.events .eventsElement[eid="'+d.eid+'"] input[name="checkEvent"]').each(function(){
            var se_id = $(this).attr('inc_id');
            if(sids.indexOf(se_id)==-1){
                $(this).removeAttr('checked');
            }
        });
        var cc = d.cc;
        var cc_inc = d.cc_inc;
        var prices = [];

        for(var i in d.p){
            var p = d.p[i];
            var price = parseInt(p['price']);

            if(!prices[p['tgi']]){
                prices[p['tgi']] = {
                    price: price,
                    id: [p['id']],
                };
            }else {
                prices[p['tgi']]['price'] += price;
            }
        }

        cl('prices', prices);
        cl('levels', levels);
        var $level = $('<div class="level">');

        $level.append('<div>Cвободно: <span class="tq_free">'+min+'</span></div>');

        for(var i in cc){
            var p = cc[i];
            //cl(prices[p['id']]);

            var $l_cont = $level;
            var hide = 0;
            //cl(',,,,,,', p);
            if(p['parent_id']){
                var parent_id = p['parent_id'];
                //if($('.parent_tg_'+p['parent_id']).length)
                $l_cont = $level.find('.tgp_id_'+parent_id);
                if(!$l_cont.length){

                    $l_cont = $('<div></div>').append(
                        $('<div>').html(p['tg_pname']+'...').addClass('tarif_group_name').click(function(){
                            $(this).toggleClass('active');
                            $('.levelTarif', $(this).parent()).not('.showalways').toggle();
                        })
                    ).addClass('tarif_group, tgp_id_'+parent_id).appendTo($level);

                }

                hide = p['tg_hide'];

            }


            if(cc_inc[p["id"]]){

                var dp = cc_inc[p['id']];


                var parent_id = p['tarif_id'];
                //if($('.parent_tg_'+p['parent_id']).length)
                $l_cont = $level.find('.tgp_id_'+parent_id);
                if(!$l_cont.length){

                    $l_cont = $('<div></div>').append(
                        $('<div>').html(p['pname']+'...').addClass('tarif_group_name').click(function(){
                            $(this).toggleClass('active');
                            $('.levelTarif', $(this).parent()).not('.showalways').toggle();
                        })
                    ).addClass('tarif_group, p_id_'+parent_id).appendTo($level);

                }

                cl('dp', dp);
                for(var j in dp){
                    hide = dp[j]['hide'];

                    $l_cont.append('<div class="levelTarif pr_int'+(hide?'" style="display:none;"':' showalways"')+'><div class="levelTarifName">'+dp[j]['name']+'</div><div class="openPriceValue">'+(prices[p['id']]['price'] / 100).format(2)+'</div><div><div class="openPriceType"><div class="choose" style="display:flex"><input type="button" class="cMinus" onclick="chQuantity(\'-\', this);" value="-"><input class="cval complex" value="0" name="cval['+p['id']+']['+dp[j]['id']+']"><input class="cPlus" onclick="chQuantity(\'+\', this);" value="+" type="button"></div></div></div></div>');
                }
            }else{
                $l_cont.append('<div class="levelTarif'+(hide?'" style="display:none;"':' showalways"')+'><div class="levelTarifName">'+p['pname']+'</div><div class="openPriceValue">'+(prices[p['id']]['price'] / 100).format(2)+'</div><div><div class="openPriceType"><div class="choose" style="display:flex"><input type="button" class="cMinus" onclick="chQuantity(\'-\', this);" value="-"><input class="cval complex" value="0" name="cval['+p['id']+'][0]"><input class="cPlus" onclick="chQuantity(\'+\', this);" value="+" type="button"></div></div></div></div>');

            }


        }
        $form.append($level);
        $form.append('<div class="clear">');





    }else{
        var $levelsAll = $('<div class="levelsAll">');
        $levelsAll.append('<div>Cвободно всего: <span class="tq_free_all">'+sum+'</span></div>');

        for(var i in levels){


            var $level = $('<div class="level">');

            $level.append('<span class="levelname" t_range="'+levels[i]['t_range']+'" tq_free="'+levels[i]['tq_free']+'" tq_range="'+levels[i]['tq_range']+'" level_id="'+levels[i]['l_id']+'">'+levels[i]['l_name']+'</span>')

            $level.append('<div>Cвободно: <span class="tq_free">'+levels[i]['tq_free']+'</span></div>');


            for(var sort_prices in prices[ levels[i]['price_id'] ]){
                //+p['name']+
                for(var j in prices[ levels[i]['price_id'] ][ sort_prices ]){
                    var p = prices[ levels[i]['price_id'] ][ sort_prices ][j];
                    var $l_cont = $level;
                    var hide = 0;
                    if(p['parent_id']){
                        //if($('.parent_tg_'+p['parent_id']).length)
                        $l_cont = $level.find('.tgp_id_'+p['parent_id']);
                        if(!$l_cont.length){

                            $l_cont = $('<div></div>').append(
                                $('<div>').html(p['tg_pname']+'...').addClass('tarif_group_name').click(function(){
                                    $(this).toggleClass('active');
                                    $('.levelTarif', $(this).parent()).not('.showalways').toggle();
                                })
                            ).addClass('tarif_group, tgp_id_'+p['parent_id']).appendTo($level);
                        }

                        hide = p['tg_hide'];
                    }

                    $l_cont.append('<div class="levelTarif'+(hide?'" style="display:none;"':' showalways"')+'><div class="levelTarifName">'+(p['tname']?' '+p['tname']:'')+'</div><div class="openPriceValue"> '+(p['price'] / 100).format(2)+' руб.</div><div><div class="openPriceType"><div class="choose" style="display:flex"><input type="button" class="cMinus" onclick="chQuantity(\'-\', this);" value="-"><input class="cval" value="0" name="cval['+levels[i]['tid']+']['+levels[i]['price_id']+']['+parseInt(p['tid'])+']"><input class="cPlus" onclick="chQuantity(\'+\', this);" value="+" type="button"></div></div></div></div>')
                    //<div class="button2 price buy" onclick="reserve('+levels[i]['l_id']+', '+levels[i]['price_id']+', '+parseInt(p['tid'])+', 1)">'+(p['price'] / 100).format(2)+'</div>
                }
            }



            /*   levelsString
            id: "2"
            name: "Стандарт"
            price: "274.4"
            price_value: "343"
            tid: "1"
            tname: "Скдика 20%"
            ttype: "2"
            tvalue: "20"
            */
            $levelsAll.append($level);
            $levelsAll.append('<div class="clear">');



        }
        $form.append($levelsAll);
    }



    $obj.append($form);
    thread(function(){
        $('.button').button();
    })

}
