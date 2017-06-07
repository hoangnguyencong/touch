const serializeComment = (comment, currentUserId) => {
  comment.likeCount = comment.likes && comment.likes.length || 0
  comment.liked = !!comment.likeCount && (comment.likes.indexOf(currentUserId) >= 0)

  return comment
}

const serializeComments = (comments, currentUserId) => {
  return comments.map((comment) => {
    return serializeComment(comment, currentUserId)
  })
}

export default {
  serializeComment,
  serializeComments
}
