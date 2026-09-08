function loadFull() {
    $(document).ready(function () {

        var count_teasers = fourth_count + fifth_count;
        var getTeaser = domen + '/news/getteaser?group=' + group + '&count=' + count_teasers + '&sp=' + sp + '&skip=' + skip + '&offset=' + offset;

        $.getJSON(getTeaser, function (data) {

            $('#ajax_load').append(
                '<div class="load">\
                  <div class="third">\
                    <div class="item-fourth"></div>\
                  </div>\
                  <div class="fourth">\
                    <div class="item-fifth"></div>\
                  </div>\
                </div>'
            );

            index = 1;

            // fourth_count
            currentindex = index;
            for (i = currentindex; i <= fourth_count + currentindex - 1; i++) {
                index++;
                $('#ajax_load .load:last-child .item-fourth').append(
                    '<div class="item-fourth__unit" data-index="' + index + '">\
              <a href="' + domen + data[i - 1]['url'] + '" class="item-fourth__link" target="_blank">\
                <span class="item-fourth__img">\
                  <img src="' + domen + data[i - 1]['photo'] + '" alt="">\
                </span>\
                <span class="item-fourth__title">' + data[i - 1]['title'] + '</span>\
              </a>\
            </div>'
                );
            }

            // fifth_count
            currentindex = index;
            for (i = currentindex; i <= fifth_count + currentindex - 1; i++) {
                index++;
                $('#ajax_load .load:last-child .item-fifth').append(
                    '<div class="item-fifth__unit" data-index="' + index + '">\
              <a href="' + domen + data[i - 1]['url'] + '" class="item-fifth__link" target="_blank">\
                <span class="item-fifth__title" style="background-image: url(' + domen + data[i - 1]['photo'] + ');">\
                  <span class="item-fifth__title-inner">' + data[i - 1]['title'] + '</span>\
                </span>\
                <span class="item-fifth__img">\
                  <img src="' + domen + data[i - 1]['photo'] + '" alt="">\
                </span>\
              </a>\
            </div>'
                );
            }

            offset = offset + index - 1;
            console.log(offset);
            block = false;

        });

    });
}