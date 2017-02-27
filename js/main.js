var reviews = [];
var postingReviews = document.querySelector('.reviews-list');

function SaveReviews() {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function GetReviews() {
    if (localStorage.getItem('reviews')) {
        reviews = JSON.parse('['+localStorage.getItem('reviews')+']')[0];
    } else {
        SaveReviews();
    }
}

function EditReview(index) {
    var oldPost = document.getElementById('post-'+index);
    var newReview = document.querySelector('#post-new-text-'+index);
    newReview.classList.remove("hide");
    newReview.value = oldPost.innerText;
    var btnSave = document.querySelector("#review-" + index + " .review-save");
    btnSave.classList.remove("hide");
    var btnEdit = document.querySelector("#review-" + index + " .review-edit");
    btnEdit.classList.add("hide");
}

function SaveReview(index) {
    var editReview = reviews[index];
    editReview = JSON.parse(editReview);
    var newReview = document.querySelector('#post-new-text-'+index);
    editReview.review = newReview.value;
    editReview = JSON.stringify(editReview);
    reviews[index] = editReview;
    SaveReviews();
    RenderReviews();
}

function RemoveReview(index) {
    reviews.splice(index, 1);
    SaveReviews();
    RenderReviews();
}

moment.locale('ru');
moment.relativeTimeThreshold('m', 59);

function TimeDisplay() {
    var currentTime = moment();
    var date = new Date();
    var offset = date.getTimezoneOffset() * (-1);
    var timers = [];
    timers = document.getElementsByClassName('date-post');
    var i = 0;
    while (i < timers.length) {
        var from = timers[i].getAttribute('data-origin');
        var postDate = moment(from,'DD-MM-YYYY HH:mm:ss');
        var postDateOffset = moment(postDate.valueOf());
        postDateOffset = postDateOffset.add(offset, 'minutes');
        var diff = currentTime.diff(postDateOffset);
        var diffMinutes = moment(diff).minute();
        var diffHours = moment(diff).hour();
        if ((diffHours > 0) || (diffMinutes >= 30 && diffHours >= 0)) {
            timers[i].innerHTML = from;
        } else {
            timers[i].innerHTML = postDate.fromNow();
        }
        i++;
    }
}

setInterval(TimeDisplay, 2000);

function ShowReview(index,userName, userReview, dateReview) {
    var postNew = document.createElement('article');
    postNew.id = 'review-'+index;
    postNew.className = 'reviews-item';
    postNew.innerHTML += '<a href="#" class="user-name">'+userName+'</a>';
    postNew.innerHTML += '<div id="post-'+index+'" class="post">'+userReview+'</div>';
    postNew.innerHTML += '<textarea name="" id="post-new-text-'+index+'" rows="3" class="edit-form-review hide" maxlength="256"></textarea>';
    postNew.innerHTML += '<footer class="review-footer"><span id="date-post-'+index+'" data-origin="'+dateReview+'" class="date-post">'+dateReview+'</span><div class="review-panel"><button type="button" class="review-save hide" onclick="SaveReview('+index+')">Cохранить</button><button type="button" class="review-edit" onclick="EditReview('+index+')">Редактировать</button><button type="button" class="review-remove" onclick="RemoveReview('+index+')">Удалить отзыв</button></div></footer>';

    postingReviews.insertBefore(postNew, postingReviews.firstChild);
}

function RenderReviews() {
    GetReviews();
    postingReviews.innerHTML = '';
    for (var i = 0; i < reviews.length; i++) {
        var review = reviews[i];
        review = JSON.parse(review);
        ShowReview(i,review.name,review.review,review.date);
    }
    TimeDisplay();
}
RenderReviews();

function Posting() {
    var formName = document.querySelector('.form-name');
    var formPhone = document.querySelector('.form-phone');
    var formReview = document.querySelector('.form-review');
    var d = new Date();

    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
        + ":" + ("0" + d.getSeconds()).slice(-2);
    var newPost = {
        name: formName.value,
        phone: formPhone.value,
        review: formReview.value,
        date: datestring
    };
    var newPost_JSON = JSON.stringify(newPost);
    reviews.push(newPost_JSON);

    SaveReviews();
    RenderReviews();

    formName.value = '';
    formPhone.value = '';
    formReview.value = '';

    var maxLength = document.querySelector('.maxlength');
    maxLength.innerHTML = 'Осталось 256 символов';
}

var formReviewLength = document.querySelector('.form-review');

function PostMaxLength() {
    var lengthReview = document.querySelector('.form-review').value.length;
    var length = 256 - lengthReview;
    var maxLength = document.querySelector('.maxlength');
    maxLength.innerHTML = 'Осталось ' +length+ ' символов';
}

PostMaxLength();

formReviewLength.addEventListener('input', function() {
    PostMaxLength();
});

document.querySelector('.create-review').addEventListener('submit', function(event) {
    event.preventDefault();
    Posting();
});





