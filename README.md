# cbl-better-reviews

## Likes
### Liking things
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

### Things you have personally liked
Display the personal likes icon using a DOM attribute:
```
<div
    class="better-reviews__personal-likes"
    data-better-reviews-personal-likes
>
</div>
```

Include the total number of things they have liked using a DOM attribute:
```
<div
    class="better-reviews__personal-likes"
    data-better-reviews-personal-likes
>
	<span
        class="better-reviews__personal-likes__count"
        data-better-reviews-personal-likes-total
    ></span>
</div>
```

Display the personal likes icon using a shortcode:
```
[better-reviews-personal-likes]
```

Include the total number of things they have liked using a shortcode:
```
[better-reviews-personal-likes display="totalLikes"]
```

## Rating

### How to do stars in css
https://codepen.io/andreacrawford/pen/NvqJXW

### Add inline ratings via a shortcode
```
[better-reviews post_id="12345" display="inline_rating"]
```