<?php echo '<?xml version="1.0" encoding="UTF-8"?>';?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
         xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    @foreach($crawlable_pages as $page)
    <url>
        <loc>{{URL::to($page->page_url)}}</loc>
        <changefreq>{{$page->page_freq }}</changefreq>
        <priority>{{$page->crawler_priority}}</priority>
    </url>
    @endforeach
</urlset>