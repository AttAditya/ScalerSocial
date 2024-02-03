var data = [];

function loadData() {
    data = localStorage.getItem("data");
    
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

function createCommentTemplate(card_id, card_message) {
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
                                <button class="card-controls-button">
                                    <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/028/original/edit.png?1706888661" alt="Edit">
                                </button>

                                <button class="card-controls-button" onclick="deleteComment('${card_id}');">
                                    <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/027/original/delete.png?1706888643" alt="Delete">
                                </button>
                            </div>
                        </div>

                        <div class="card-message">
                            ${card_message}
                        </div>
                    </div>

                    <div class="card-interactions">
                        <button class="card-interactions-button">
                            <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/026/original/comment.png?1706888619" alt="Comment">
                        </button>

                        <button class="card-interactions-button">
                            <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/029/original/heart.png?1706888679" alt="Like">
                        </button>
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

    let feed_container = document.getElementById(container);
    if (!input_data) {
        let post_input = document.getElementById("post-content-input");
        
        card_id = `comment-${randomId(10)}`;
        card_msg = post_input.value;
        post_input.value = "";
    } else {
        card_id = input_data.id;
        card_msg = input_data.msg;
    }

    let card = createCommentTemplate(card_id, card_msg);

    feed_container.innerHTML = card + feed_container.innerHTML;

    if (!input_data) {
        data.unshift({
            id: card_id,
            msg: card_msg,
            container: container
        });
        localStorage.setItem("data", JSON.stringify(data));
    }
}

function deleteComment(commentId) {
    document.getElementById(commentId).remove();
    data = data.filter(c => c.id != commentId);
    localStorage.setItem("data", JSON.stringify(data));
}

