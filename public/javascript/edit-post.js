async function editFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const category_name = document.querySelector('select[name="post-category"]').value;
    const post_url = document.querySelector('input[name="post-url"]').value;
    const post_text = document.querySelector('textarea[name="post-text"]').value;
    const post_image = document.querySelector('input[name="post-image"]').value;


    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title,
            category_name,
            post_text,
            post_image,
            post_url
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard/admin')
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);
