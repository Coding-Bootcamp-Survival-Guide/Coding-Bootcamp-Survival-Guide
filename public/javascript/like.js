async function likeClickHandler(event) {
    event.preventDefault();
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    if (event.target.classList.value === 'like-button') {
      const response = await fetch('/api/likes', {
        method: 'POST',
        body: JSON.stringify({
          post_id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }

    } else {
      const like_id_obj = document.querySelector('.liked-button');
      let like_id = like_id_obj.id.replace('like-id-','');  
      const response = await fetch(`/api/likes/${like_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    }
  }
  
  document.querySelector('.buttons').addEventListener('click', likeClickHandler);
