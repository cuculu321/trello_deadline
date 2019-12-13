function append_bar(){
    console.log("run");
    //各カードの取得
    var htmlcollection_card = document.getElementsByClassName('list-card-details js-card-details');

    card_num = htmlcollection_card.length;
    for(var i = 0; i < card_num; i++){

        //古いバーを全て消去
        old_deadline_bar = htmlcollection_card.item(i).getElementsByTagName('progress');
        if(old_deadline_bar.length > 0){
            htmlcollection_card.item(i).removeChild(old_deadline_bar.item(0));
        }

        //カードの期限を取得
        deadline = htmlcollection_card.item(i).getElementsByClassName('badge-text js-due-date-text');
        if(deadline[0] !== undefined){ //期限付きのカードのみ処理

            var class_badges = htmlcollection_card.item(i).getElementsByClassName("badges");
            class_badges.item(0).style.float = 'none';
            console.log(class_badges.item(0).style);

            var until_deadline = day_until_deadline(deadline[0].textContent);

            var par_until_deadline = 1 - until_deadline / 30;
            if(par_until_deadline >= 1){
                par_until_deadline = 1;
            }else if(par_until_deadline < 0){
                par_until_deadline = 0;
            }

            var progress_bar = document.createElement('progress');
            progress_bar.value = par_until_deadline.toString();
            
            if(par_until_deadline === 1){
                progress_bar.className = "deadline_end";
            }else if(0.66 <= par_until_deadline && par_until_deadline < 1){
                progress_bar.className = "deadline_danger";
            }else if(0.33 <= par_until_deadline && par_until_deadline < 1){
                progress_bar.className = "deadline_mild";
            }else{
                progress_bar.className = "deadline_safe";
            }

            htmlcollection_card.item(i).appendChild(progress_bar);
        }
    }
}

function day_until_deadline(deadline_nengapi){
    var now_time = new Date();

    if(deadline_nengapi.indexOf("年") === -1){
        var enough_deadlinne_nengapi = now_time.getFullYear() + "年" + deadline_nengapi;
    }else{
        var enough_deadlinne_nengapi = deadline_nengapi;
    }

    var deadline_date = enough_deadlinne_nengapi.replace(/年|月|日/g , '-');
    deadline_date = deadline_date.slice(0, -1);
    deadline_date = new Date(deadline_date);
    var until_deadline = ( deadline_date - now_time) / 86400000;
    return until_deadline
}

function observe_board(){
    
    append_bar();

    var window_change = document.getElementById("trello-root");
    //const target = document.querySelector('title');

    const window_observer = new MutationObserver(delay_append_bar);

    window_observer.observe(window_change, {
        attributes: true,
        childList: true
    })

    var card_change = document.body;

    const card_observer = new MutationObserver(append_bar);

    card_observer.observe(card_change, {
        attributes: true,
        childList: true
    })
}

function delay_append_bar(){
    window.setTimeout(append_bar, 300);
}
window.onload = observe_board;
//window.addEventListener('load', function(){console.log("loaded")});