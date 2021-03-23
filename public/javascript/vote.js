async function voteClickHandler(event) {
    event.preventDefault();
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    if (event.target.classList.value === 'like-button') {
      const response = await fetch('/api/votes', {
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
      const vote_id_obj = document.querySelector('.liked-button');
      let vote_id = vote_id_obj.id.replace('vote-id-','');  
      const response = await fetch(`/api/votes/${vote_id}`, {
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
  
  document.querySelector('.buttons').addEventListener('click', voteClickHandler);
