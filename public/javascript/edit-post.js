async function editFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const category = document.querySelector('input[name="post-category"]').value.trim();
    const post_url = document.querySelector('input[name="post-url"]').value.trim();
    const post_text = document.querySelector('textarea[name="post-text"]').value.trim();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title,
            category,
            post_text,
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