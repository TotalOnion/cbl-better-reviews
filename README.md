# cbl-better-reviews

The Better Reviews plugin allows any post type to receive "likes", which can be used to gauge popularity and to allow a user to build up a library of items they have liked. This library is stored entirely browser side so as to require no database hit.

Better Reviews also allows any post type to be reviewed using user defined criteria each ranked from 0.5 to 5 stars which are added up to an average star rating.

## Instalation & Notes
During this development period you need to add an entry to the `repositories` array in your `composer.json` file:
```
{
    "type": "vcs",
    "url": "https://github.com/TotalOnion/cbl-better-reviews.git"
},
```

Additionally you need to set the minimum-stability, also in your `composer.json` file:
```
"minimum-stability": "dev",
```

And then run:
```
composer require totalonion/cbl-better-reviews
```

Once the plugin is installed, activate it in wp-admin.

The plugin does not include any css. In all of the examples below the css class is irrelevant and shown for illustration only, all functionality is added using the `data-better-reviews-` prefixed attributes.

## Likes
Like have no configuration. Any post type can have likes applied to it using any of the methods outlined below.
### Liking things
You can add the ability to "Like" something by using a DOM attribute:
```
<div
    class="my_like_icon"
    data-better-reviews-like="{{ post.id }}"
></div>
```
The frontend js will add in classes for if a user has personally liked the item, as well as all the functionality to like or unlike the item.

Alternatively you can add a Like icon to the current page using a shortcode:
```
[better-reviews-like]
```
This will use the current post / page / cpt ID. If this is used on an archive page it will not do anything.

If you want to include a like icon on an Archive page using a shortcode then you can use the format below:
```
[better-reviews-like id="1234"]
```

### Things you have personally liked
You can display the "things I have personally liked" icon using a DOM attribute:
```
<div
    class="better-reviews__personal-likes"
    data-better-reviews-personal-likes
>
</div>
```

To include the total number of things they have liked you can use a DOM attribute:
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

Here's the personal likes icon using a shortcode:
```
[better-reviews-personal-likes]
```

And this adds the total number of things they have liked, using a shortcode:
```
[better-reviews-personal-likes display="totalLikes"]
```

## Rating

Ratings _do_ have to be configured in the admin as the system needs to know what the review criteria are. The admin can be found under `Pernod Ricard` -> `Better Reviews`

Select what Post Types can receive reviews and hit save.

Then add in the text labels. This adds the text for your site's default language. To add in translations of these please use your String Translation system and filter using the text domain `cbl-better-reviews` (admin labels can be found in `cbl-better-reviews-admin` and API error messages in `cbl-better-reviews-api`).

### Add a rating via a Gutenberg block
The plugin adds a Better Reviews gutenberg block that can be used on Page Single templates for any post type it is enabled on. In that block you can select if the block should show the full review frontend, including the ability to add a review, or the inline rating which will just show the avergae star rating.

## Customising the thank you message
The thank you message supports shortcodes so it can be customised as required. The plugin also comes with a basic shortcode `[better-reviews-page-title]` which will put the title of the current page in the thank you message.

### How to do pure css stars
https://codepen.io/andreacrawford/pen/NvqJXW

### Add ratings via a shortcode
To add the rating block via a shortcode you can use the following:
```
[better-reviews post_id="{{ post.id }}" display="stars,review_count"]
```
Where `display` is a csv of the following options:
 - `display_full` which displays the full review html; subcriteria, average, star rating, and review count. Adding any other value after display_full will do nothing.
 - `stars` displays the average star rating
 - `review_count` displays the number of times a review has been submitted, in the form "104", or "3.2K" or "2.6M"

### Customising the html the plugin creates
The html the shortcodes create is designed to be minimal and semantic so it can be easily styled. If however you want to change the html that the pplugin produces you can use the following filters.

|--|--|
| filter | Used to filter the html of |
|--|--|
| better_reviews_like_icon_filter | The "Like an item" icon |
| better_reviews_personal_likes_icon_filter | The "things I have personally liked" icon |
| better_reviews_review_block_filter | The reviews block. This filter is used for all review types. |

## JS Events
Below is a list of all the events fired.

|--|--|
| Event name | Description |
| better-reviews:likes-ready | When the likes js is ready to use |
| better-reviews:personal-like-total-changed | When the total number of things liked has gone up or down |
| better-reviews:reviews-loaded | When all the review data for the page has been loaded. Data is contained in the `detail` property of the event |

