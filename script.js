var data = [];

function loadData() {
    data = localStorage.getItem("ScalerSocial-data");
    
    if (data == null) {
        data = "[]";
    }

    data = JSON.parse(data);

    for (let i = data.length - 1; i >= 0; i--) {
        let card = data[i];
        pushPost(card.container, card);
    }
}

function randomId(size) {
    let chars = "abcdefghijklmnopqrstuvwxyz1234567890";
    let temp = "";

    for (let i = 0; i < size; i++) {
        temp += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return temp;
}

function createCommentTemplate(card_id, card_message, card_liked) {
    let template = `
        <div class="card" id="${card_id}">
            <div class="card-main">
                <div class="card-author-image">
                    <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739" alt="Profile Image">
                </div>

                <div class="card-content">
                    <div class="card-texts">
                        <div class="card-header">
                            <div class="card-user-info">
                                <h3 class="card-user-name">Joanne Graham</h3>
                                <span class="card-user-id">@joannegraham123</span>
                            </div>

                            <div class="card-controls">
                                <button class="card-controls-button" onclick="editComment(this);">
                                    <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/028/original/edit.png?1706888661" alt="Edit">
                                </button>

                                <button class="card-controls-button" onclick="deleteComment('${card_id}');">
                                    <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/027/original/delete.png?1706888643" alt="Delete">
                                </button>
                            </div>
                        </div>

                        <textarea class="card-message" disabled maxlength="100" oninput="updateEditCharCounter(this);">${card_message}</textarea>
                    </div>

                    <div class="card-interactions">
                        <button class="card-interactions-button" onclick="createNewComment(this);">
                            <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/026/original/comment.png?1706888619" alt="Comment">
                        </button>

                        <button class="card-interactions-button like-button" onclick="toggleLike('${card_id}');">
                            <img src="${!card_liked ? 'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/029/original/heart.png?1706888679' : 'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/025/original/state_clicked.png?1706888455'}" alt="Like">
                        </button>
                    </div>

                    <div class="card-edit">
                        <div class="text-limit">
                            <span class="edit-char-used">0</span> / 100
                        </div>

                        <div class="card-edit-ctx">
                            <button class="button edit-cancel-button" onclick="cancelComment(this);">
                                Cancel
                            </button>
                            <button class="button edit-push-button" onclick="editPush(this);">
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-comments" id="comments-${card_id}"></div>
        </div>
    `;

    return template;
}

function pushPost(container, input_data=null) {
    let card_id;
    let card_msg;
    let card_liked;

    let feed_container = document.getElementById(container);
    if (feed_container == null) {
        if (input_data) {
            deleteComment(input_data.id); 
        }
        
        return;
    }

    if (!input_data) {
        let post_input = document.getElementById("post-content-input");
        
        card_id = `comment-${randomId(10)}`;
        card_msg = post_input.value;
        card_liked = false;
        post_input.value = "";
        document.getElementById('post-char-used').innerHTML = "0";
    } else {
        card_id = input_data.id;
        card_msg = input_data.msg;
        card_liked = input_data.liked;
    }

    if (!card_msg) {
        return;
    }

    let card = createCommentTemplate(card_id, card_msg, card_liked);
    feed_container.innerHTML = card + feed_container.innerHTML;

    if (!input_data) {
        data.unshift({
            id: card_id,
            msg: card_msg,
            container: container,
            liked: false
        });
        localStorage.setItem("ScalerSocial-data", JSON.stringify(data));
    }
}

function deleteComment(commentId, force=false) {
    let comment = document.getElementById(commentId);
    
    if (force) {
        data = data.filter(c => c.id != commentId);
        localStorage.setItem("ScalerSocial-data", JSON.stringify(data));
        return;
    }

    if (comment) {
        let modal = document.getElementById("delete-modal");
        modal.open = true;

        modal.querySelector(".delete-button").onclick = () => {
            comment.remove();
            data = data.filter(c => c.id != commentId);
            localStorage.setItem("ScalerSocial-data", JSON.stringify(data));
            modal.open = false;
        };
    } else {
        data = data.filter(c => c.id != commentId);
        localStorage.setItem("ScalerSocial-data", JSON.stringify(data));
    }
}

function toggleLike(card_id) {
    let reg_heart = "https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/029/original/heart.png?1706888679";
    let sol_heart = "https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/025/original/state_clicked.png?1706888455";

    let card_liked = false;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == card_id) {
            data[i].liked = !data[i].liked;
            card_liked = data[i].liked;
        }
    }

    localStorage.setItem("ScalerSocial-data", JSON.stringify(data));

    let heart = document.querySelector(`#${card_id} .like-button > img`);
    heart.src = card_liked ? sol_heart : reg_heart;
}

function updateEditCharCounter(source) {
    source.parentElement.parentElement.querySelector(".edit-char-used").innerText = source.value.length;
    source.style.height = source.scrollHeight + "px";
}

function editComment(source, empty=false) {
    let txa = source.parentElement.parentElement.parentElement.querySelector(".card-message");
    
    txa.disabled = false;
    txa.placeholder = txa.value;
    
    if (empty) {
        txa.value = "";
    }

    updateEditCharCounter(txa);

    txa.focus();
}

function cancelComment(source) {
    let txa = source.parentElement.parentElement.parentElement.querySelector(".card-message");
    txa.disabled = true;
    txa.value = txa.placeholder;
}

function editPush(source) {
    let card = source.parentElement.parentElement.parentElement.parentElement.parentElement;
    let txa = card.querySelector(".card-message");
    if (!txa.value) {
        return;
    }

    txa.disabled = true;
    txa.placeholder = txa.value;

    for (let i = 0; i < data.length; i++) {
        if (data[i].id == card.id) {
            data[i].msg = txa.value;
        }
    }

    localStorage.setItem("ScalerSocial-data", JSON.stringify(data));
}

function createNewComment(source) {
    let card = source.parentElement.parentElement.parentElement.parentElement;

    let input_data = {
        id: `comment-${randomId(10)}`,
        msg: "Type your thoughts here...",
        container: "comments-" + card.id,
        liked: false
    };
    
    data.unshift(input_data);
    localStorage.setItem("ScalerSocial-data", JSON.stringify(data));
    
    pushPost("comments-" + card.id, input_data);

    let comment = document.getElementById(input_data.id);
    editComment(comment.querySelector(".card-controls-button"), true);

    comment.querySelector(".edit-cancel-button").onclick = () => {
        deleteComment(comment.id, true);
    };
}

