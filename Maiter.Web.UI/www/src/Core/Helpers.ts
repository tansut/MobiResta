export function GetYoutubeThumbnail(url: string, fileName: string = 'default.jpg') {
    var parts = url.split('/');
    var id = GetYoutubeId(url);
    var protocol = url.indexOf('https://') == 0 ? 'https://' : 'http://';
    return protocol + 'img.youtube.com/vi/' + id + '/' + fileName;
}

export function GetYoutubeId(url: string) {
    var parts = url.split('/');
    var id = parts[parts.length - 1].replace('watch?v=', '');
    return id;
}

export function GetYoutubeEmbedUrl(url: string, autoplay: boolean = false) {
    var id = GetYoutubeId(url);
    var protocol = url.indexOf('https://') == 0 ? 'https://' : 'http://';
    return protocol + 'www.youtube.com/embed/' + id + (autoplay ? '?autoplay=1':'');
}

