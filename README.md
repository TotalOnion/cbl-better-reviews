# cbl-better-reviews

## Likes
Adding the ability to "Like" using a DOM attribute:
```
<div
    class="my_like_icon"
    data-better-reviews-like="{{ post.id }}"
></div>
```

Adding a Like icon to the current page using a shortcode:
```
[better-reviews-like]
```

Adding a Like icon based on a Page / Post ID:
```
[better-reviews-like id="1234"]
```