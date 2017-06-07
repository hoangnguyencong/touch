const serializePost = (post, currentUserId) => {
  post.likeCount = post.likes && post.likes.length || 0
  post.liked = !!post.likeCount && (post.likes.indexOf(currentUserId) >= 0)

  post.bookmarkCount = post.bookmarks && post.bookmarks.length || 0
  post.bookmarked = !!post.bookmarkCount && (post.bookmarks.indexOf(currentUserId) >= 0)

  return post
}

const serializePosts = (posts, currentUserId) => {
  return posts.map((post) => {
    return serializePost(post, currentUserId)
  })
}

export default {
  serializePost,
  serializePosts
}
