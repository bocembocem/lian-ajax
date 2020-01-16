$(function() {
    onLoad();
    window.addEventListener('resize', function() {
        onResize();
    });
    window.addEventListener('popstate', function() {
        goBack();
    });  

    $('.header__nav-burger').on('click', function() {
        $('.header__nav').slideToggle();
    });    
});

function onLoad() {
    let url = window.location.pathname;
    if ((url == '/') || (url == '/index.html')) {
        onLoadHome();
    } else if (url == '/about.html') {
        onLoadAbout();
    } else if (url == '/portfolio.html') {
        onLoadPortfolio();
    } else if (url == '/portfolio-details.html') {
        onLoadPortfolioDetails();
    } else if (url == '/blog.html') {
        onLoadBlog();
    }

    $('a').each(function() {
        if($(this).attr('data-ajax') != 'true') {
            $(this).attr('data-ajax', 'true')
            $(this).on('click', function(e) {                
                e.preventDefault();        
                let href = $(this).attr('href');
                
                if(href != '#') {
                    $('main').animate({
                        opacity: 0
                    }, function() {
                        $(this).load(href + ' .main-inner', function() {
                            history.pushState(href, "page", href);
                            $(this).animate({
                                opacity: 1
                            });
                            onLoad();
                        });
                    }); 
                }                 
            });
        }
    });
}

function goBack() {
    let url = window.location.pathname;
    $('main').animate({
        opacity: 0
    }, function() {
        $(this).load(url + ' .main-inner', function() {
            $(this).animate({
                opacity: 1
            });
            onLoad();
        });
    });
}

function onResize() {
    let url = window.location.pathname;
    if ((url == '/') || (url == '/index.html')) {
        portfolioLayerOnResize();
        distributionPortfolioItems();
    } else if (url == '/portfolio.html') {
        portfolioLayerOnResize();
        distributionPortfolioItems();
    } else if (url == '/blog.html') {
        distributionBlogItems();
    }
    menuHide();
}

function onLoadHome() {
    let slides = [];
    let controls = [];

    $('.carousel-slide').each(function() {
        slides.push($(this));
    });
    $('.carousel__controls--button').each(function() {
        controls.push($(this));
        $(this).on('click', function() {
            $('.carousel__controls--button').removeClass('carousel__controls--button-active');
            $(this).addClass('carousel__controls--button-active');
            let delta = $(this).attr('data-slide') * 100;
            $('.carousel-slide').first().animate({
                marginLeft: -delta + '%'
            }, 1000);
        });
    });
    $('.carousel__arrow').first().on('click', function() {
        let activeNum = $('.carousel__controls--button-active').attr('data-slide');
        $('.carousel__controls--button').removeClass('carousel__controls--button-active');

        if(activeNum == 0) {
            $('.carousel__controls--button').last().addClass('carousel__controls--button-active');
            activeNum = $('.carousel__controls--button').last().attr('data-slide');
            let delta = 100 * activeNum;
            $('.carousel-slide').first().animate({
                marginLeft: -delta + '%'
            }, 1000);
        } else {            
            activeNum -= 1;
            controls[activeNum].addClass('carousel__controls--button-active');
            let delta = 100 * activeNum;
            $('.carousel-slide').first().animate({
                marginLeft: -delta + '%'
            }, 1000);
        }
    });
    $('.carousel__arrow').last().on('click', function() {
        let activeNum = parseInt($('.carousel__controls--button-active').attr('data-slide'));
        $('.carousel__controls--button').removeClass('carousel__controls--button-active');
        

        if(activeNum == controls.length - 1) {
            $('.carousel__controls--button').first().addClass('carousel__controls--button-active');
            activeNum = 0;
            let delta = 100 * activeNum;
            $('.carousel-slide').first().animate({
                marginLeft: -delta + '%'
            }, 1000);
        } else {            
            activeNum += 1;
            controls[activeNum].addClass('carousel__controls--button-active');
            let delta = 100 * activeNum;
            $('.carousel-slide').first().animate({
                marginLeft: -delta + '%'
            }, 1000);
        }
    });    
    $('.load-more').on('click', function() {
        loadMorePortfolio();
    });
    portfolioGetLayer();
    for (let i = 0 ; i < slides.length; i++) {
        slides[i].attr('data-slide', i);
        controls[i].attr('data-slide', i);
    }
}

function onLoadAbout() {
    let skillsAnimate = setInterval(function() {
        let url = window.location.pathname;
        if (url != '/about.html') {
            clearInterval(skillsAnimate);
        } else {
            let delta = $('.team__skills').offset().top - $(window).outerHeight();
            if (delta <= 0) {
                percentLoad();
                clearInterval(skillsAnimate);
            } else if($(window).scrollTop() - delta >= 0) {
                percentLoad();
                clearInterval(skillsAnimate);
            } 
        }
    }, 500);
}

function onLoadPortfolio() {
    portfolioGetLayer();
    $('.load-more').on('click', function() {
        loadMorePortfolio();
    });
}

function onLoadPortfolioDetails() {
    $('.portfolio-details-nav__button').each(function() {
        let attr = $(this).attr('data-name');
        let check = $(this).attr('data-ajax');
        if((attr == 'prev' || attr == 'next') && check != 'true') {
            $(this).attr('data-ajax', 'true');
            $(this).on('click', nextPortfolioDetails);
        }
    });
    $('.portfolio-details-item__share--button').on('click', function() {
        $('.portfolio-details-item__social').animate({
            opacity: 1
        });
    });
    portfolioDetailsGetLayer();
}

function onLoadBlog() {
    blogGetLayer();
    $('.load-more').on('click', function() {
        loadMoreBlog();
    });
}

function menuHide() {
    if($(window).outerWidth() < 768) {
        $('.header__nav').slideUp();
    } else {
        $('.header__nav').slideDown().css({
            display: 'flex'
        });
    }
}

function portfolioGetLayer() {
    $('.portfolio__item').each(function() {
        $(this).on('mouseenter', function() {
            $(this).children('.item-layer').css({
                display: 'flex'
            }).stop().animate({
                opacity: 1
            });
        });
        $(this).on('mouseleave', function() {
            $(this).children('.item-layer').stop().animate({
                opacity: 0
            }, function() {
                $(this).css({
                    display: 'none'
                });
            });
        });
    });
    setTimeout(portfolioLayerOnResize, 500);
}

function portfolioLayerOnResize() {
    $('.portfolio__item').each(function() {
        let imgHeight = $(this).children('img').outerHeight();
        let imgWidth = $(this).children('img').outerWidth();
        let deltaLeft = ($(this).innerWidth() - imgWidth) / 2;
        $(this).children('.item-layer').css({
            height: imgHeight,
            width: imgWidth,
            left: deltaLeft
        });
    });
}

function loadMorePortfolio() {
    if($(window).outerWidth() < 768) {
        for(let i = 0; i < 3; i++) {
            let rand = Math.floor(Math.random() * (11 - 1)) + 1;
            let url = 'ajax/portfolio-item' + rand + '.html';
            $('.portfolio__column').last().append('<div class="portfolio__item"></div>');
            $('.portfolio__column').last().children('.portfolio__item').last().css({
                opacity: 0
            }).load(url, function() {
                portfolioGetLayer();
                portfolioLayerOnResize();
            }).animate({
                opacity: 1
            }, 1000); 
        }
    } else {
        let portfolioColumn = [];

        $('.portfolio__column').each(function() {
            portfolioColumn.push($(this));
        });

        for(let i = 0; i < portfolioColumn.length; i++) {
            let rand = Math.floor(Math.random() * (11 - 1)) + 1;
            let url = 'ajax/portfolio-item' + rand + '.html';

            $(portfolioColumn[i]).append('<div class="portfolio__item"></div>');
            $(portfolioColumn[i]).children('.portfolio__item').last().css({
                opacity: 0
            }).load(url, function() {
                portfolioGetLayer();
                portfolioLayerOnResize();
            }).animate({
                opacity: 1
            }, 1000);        
        }
    }
}    

function distributionPortfolioItems() {
    if($(window).outerWidth() > 767) {
        let items = [];
        let columns = [];
        let normal = $('.portfolio__column').first().children('.portfolio__item').length;

        $('.portfolio__column').each(function() {
            columns.push($(this));
        });
        $('.portfolio__column').last().children('.portfolio__item').each(function () {
            items.push($(this));
        });

        for(let i = normal; i < items.length; i += columns.length) {
            for(let j = 0; j < columns.length; j++) {
                columns[j].append(items[i+j]);
            }
        }
    }
    
}

function percentLoad() {
    $('.progress-item__loader').each(function() {
        let deltaPoint = $(this).attr('data-percent');
        $(this).children('.progress-item__point').animate({
            marginLeft: deltaPoint
        }, 4000, function() {
            $('.progress-item__flag').each(function() {
                let deltaFlag = parseInt($(this).attr('data-percent')) + 1;
                $(this).css({
                    left: deltaFlag + '%'
                }).animate({
                    opacity: 1
                }, 1000);
            });
        });
    });
}

function nextPortfolioDetails() {    
    let rand = Math.floor(Math.random() * (3 - 1)) + 1;
    let url = 'ajax/details' + rand + '.html';

    $('.portfolio-details-item').animate({
        opacity: 0
    }, 1000, function() {
        $.ajax({
            url: url,
            success: function(data){
                $('.portfolio-details-item').html(data);
                onLoadPortfolioDetails();
                $('.portfolio-details-item').animate({
                    opacity: 1
                }, 1000);
            }
        });
    });
}

function portfolioDetailsGetLayer() {
    $('.item-layer').css({
        display: 'flex'
    }).first().animate({
        opacity: 1
    });
    $('.portfolio-details-item__images--small').on('click', function() {
        $('.item-layer').stop().animate({
            opacity: 0
        });
        $(this).children('.item-layer').animate({
            opacity: 1
        });
        let src = $(this).children('img').attr('src');
        $('.portfolio-details-item__images--large').children('img').animate({
            opacity: 0
        }, function() {
            $(this).attr('src', src).animate({
                opacity: 1
            });
        });
    });
}

function blogGetLayer() {
    $('.item-layer').parent().on('mouseenter', function() {
        $(this).children('.item-layer').css({
            display: 'flex'
        }).stop().animate({
            opacity: 1
        });
    });
    $('.item-layer').parent().on('mouseleave', function() {
        $(this).children('.item-layer').stop().animate({
            opacity: 0
        }, function() {
            $(this).css({
                display: 'none'
            });
        });
    });
}

function loadMoreBlog() {  
    if($(window).outerWidth() < 992) {
        for(let i = 0; i < 2; i++) {
            let rand = Math.floor(Math.random() * (7 - 1)) + 1;
            let url = 'ajax/blog-item' + rand + '.html';
            $('.blog__feed').last().append('<div class="blog-item blog__item"></div>');
            $('.blog__feed').last().children('.blog-item').last().css({
                opacity: 0
            }).load(url, function() {
                blogGetLayer();
            }).animate({
                opacity: 1
            }, 1000); 
        }
    } else {
        let blogColumn = [];

        $('.blog__feed').each(function() {
            blogColumn.push($(this));
        });

        for(let i = 0; i < blogColumn.length; i++) {
            let rand = Math.floor(Math.random() * (7 - 1)) + 1;
            let url = 'ajax/blog-item' + rand + '.html';

            $(blogColumn[i]).append('<div class="blog-item blog__item"></div>');
            $(blogColumn[i]).children('.blog-item').last().css({
                opacity: 0
            }).load(url, function() {
                blogGetLayer();
            }).animate({
                opacity: 1
            }, 1000);        
        }
    }  
}

function distributionBlogItems() {
    if($(window).outerWidth() > 991) {
        let items = [];
        let columns = [];
        let normal = $('.blog__feed').first().children('.blog-item').length;

        $('.blog__feed').each(function() {
            columns.push($(this));
        });
        $('.blog__feed').last().children('.blog-item').each(function () {
            items.push($(this));
        });

        for(let i = normal; i < items.length; i += columns.length) {
            for(let j = 0; j < columns.length; j++) {
                columns[j].append(items[i+j]);
            }
        }
    }    
}