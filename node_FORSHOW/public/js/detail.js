// 电影列表删除按钮点击
$(function() {
    $('.comment').click(function(e) {
        var target = $(this)
        var toId = target.data('tid')    // 要回复的人的id（即这条评论发布者）
        var commentId = target.data('cid')  // 这条评论的id
        // 保证点击只有一个id
        if($('#toId').length>0) {
            $('#toId').val(toId)
        }
        else {
            $('<input>').attr({
                type: 'hidden',
                id:"toId",
                name: 'comment[tid]',
                value: toId
            }).prependTo('#commentForm')
        }

        if($('#commentId').length>0) {
            $('#commentId').val(commentId)
        }
        else {
            $('<input>').attr({
                type: 'hidden',
                id:"commentId",
                name: 'comment[cid]',
                value: commentId
            }).prependTo('#commentForm')
        }

    })
})
