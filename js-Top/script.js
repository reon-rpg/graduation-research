const newsDetails = {
    holiday: {
        date: "2025.12.01",
        title: "年末年始の配送スケジュールと休業日のお知らせ",
        content: `
            <p>平素より[ブランド名]をご愛顧いただき、誠にありがとうございます。</p>
            <p>年末年始期間中の配送スケジュールおよび休業日について、以下の通りお知らせいたします。</p>
            <h3>■ 年末年始 休業期間</h3>
            <p>2025年12月30日（火）〜 2026年1月3日（土）</p>
            <h3>■ 最終発送日</h3>
            <p>年内最終発送日は 2025年12月29日（月） 午前中までのご注文分とさせていただきます。</p>
            <p>以降のご注文は、2026年1月4日（日）より順次発送いたします。</p>
            <p>お客様にはご不便をおかけいたしますが、何卒ご理解のほどお願い申し上げます。</p>
        `
    },
    seminar: {
        date: "2025.11.20",
        title: "2026年冬メイクアップトレンドセミナー開催！",
        content: `
            <p>来る2026年冬の最新メイクアップトレンドを紹介する特別セミナーを開催します。</p>
            <p>プロのメイクアップアーティストによるデモンストレーションとともに、ご自身にぴったりの冬カラーを見つけてください。</p>
            <h3>■ 開催概要</h3>
            <ul>
                <li><strong>日時:</strong> 2026年1月25日（日）14:00〜16:00</li>
                <li><strong>場所:</strong> [会場名]（オンライン同時配信あり）</li>
                <li><strong>参加費:</strong> 3,000円（税込）</li>
            </ul>
        `
    },
    sustainability: {
        date: "2025.11.05",
        title: "【SDGs】環境に配慮したパッケージへの移行について",
        content: `
            <p>当社はSDGsへの取り組みの一環として、製品パッケージを環境負荷の低い素材へ順次切り替えることをお知らせします。</p>
            <p>2026年春より、主力製品の容器に再生プラスチック（PCR）を50%以上使用し、紙箱にはFSC認証を受けた素材を採用します。</p>
            <h3>■ 主な変更点</h3>
            <ul>
                <li>プラスチック使用量の削減（平均25%減）</li>
                <li>リサイクル可能な素材への切り替え</li>
                <li>インクを植物由来のものに変更</li>
            </ul>
            <p>地球環境に配慮したものづくりを通じて、持続可能な社会の実現に貢献してまいります。</p>
        `
    },
    renewal: {
        date: "2025.10.15",
        title: "公式オンラインストアがリニューアルしました",
        content: `
            <p>この度、公式オンラインストアのデザインと機能を一新し、リニューアルオープンいたしました。</p>
            <p>今回のリニューアルでは、より快適にご利用いただけるよう、ユーザーインターフェースの改善とモバイル対応を強化しております。</p>
            <h3>■ 主な変更点</h3>
            <ul>
                <li>ブランドコンセプトを反映したモダンなデザイン</li>
                <li>スマートフォンからの購入がしやすいレイアウト</li>
                <li>過去の購入履歴やレビューが確認できるマイページ機能の強化</li>
            </ul>
            <p>今後とも、より多くのお客様にご満足いただけるようサービス向上に努めてまいります。</p>
        `
    },
    program: {
        date: "2025.10.01",
        title: "会員プログラム特典内容の改定のお知らせ",
        content: `
            <p>平素は格別のご高配を賜り、厚く御礼申し上げます。</p>
            <p>この度、より公平で魅力的なサービスを提供するため、2026年1月1日より会員プログラムの特典内容を一部改定させていただきます。</p>
            <h3>■ 主な改定内容</h3>
            <ul>
                <li>ポイント付与率のランク別見直し</li>
                <li>バースデー特典のグレードアップ</li>
                <li>年間購入額に応じた特別イベントへのご招待</li>
            </ul>
        `
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navSp = document.getElementById('nav-sp');
    const body = document.body;
    const toTop = document.querySelector('.to-top');
    const toggleButton = document.getElementById('darkModeToggle');
    const darkModeKey = 'fraise-de-lune-dark-mode';

    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        body.style.overflow = 'hidden';

        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingElement.classList.add('is-loaded');
                setTimeout(() => {
                    loadingElement.style.display = 'none';
                    body.style.overflow = '';
                }, 600);
            }, 1000);
        });
    }

    const spDropdownLinks = document.querySelectorAll('#nav-sp .dropdown > a');

    const closeAllSpDropdowns = () => {
        document.querySelectorAll('#nav-sp .dropdown').forEach(item => {
            item.classList.remove('active-sp-dropdown');
            item.querySelector('.dropdown-menu').style.display = 'none';
        });
    };

    const handleHamburgerClick = () => {
        hamburger.classList.toggle('active');
        navSp.classList.toggle('open');
        const isExpanded = navSp.classList.contains('open');

        if (isExpanded) {
            body.style.overflow = 'hidden';
            hamburger.setAttribute('aria-expanded', 'true');
            navSp.setAttribute('aria-hidden', 'false');
        } else {
            body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
            navSp.setAttribute('aria-hidden', 'true');
            closeAllSpDropdowns();
        }
    };

    if (hamburger && navSp) {
        hamburger.addEventListener('click', handleHamburgerClick);
    }

    if (navSp) {
        const spLinks = navSp.querySelectorAll('a');
        spLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (link.closest('.dropdown')) return;
                hamburger.classList.remove('active');
                navSp.classList.remove('open');
                body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
                navSp.setAttribute('aria-hidden', 'true');
                closeAllSpDropdowns();
            });
        });
    }

    spDropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const dropdownMenu = link.nextElementSibling;
            if (!dropdownMenu || !dropdownMenu.classList.contains('dropdown-menu')) return;
            
            e.preventDefault();

            const parentLi = link.closest('.dropdown');

            document.querySelectorAll('#nav-sp .dropdown').forEach(item => {
                if (item !== parentLi) {
                    item.classList.remove('active-sp-dropdown');
                    item.querySelector('.dropdown-menu').style.display = 'none';
                }
            });

            parentLi.classList.toggle('active-sp-dropdown');
            if (parentLi.classList.contains('active-sp-dropdown')) {
                dropdownMenu.style.display = 'block';
            } else {
                dropdownMenu.style.display = 'none';
            }
        });
    });

    const allScrollElements = document.querySelectorAll('.scroll-animation, .category-item, .news-item');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    allScrollElements.forEach(el => {
        observer.observe(el);
    });

    const toggleDarkMode = () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        
        if (isDark) {
            localStorage.setItem(darkModeKey, 'enabled');
        } else {
            localStorage.setItem(darkModeKey, 'disabled');
        }
    };
    
    const loadDarkModeSetting = () => {
        const isDarkMode = localStorage.getItem(darkModeKey) === 'enabled';
        if (isDarkMode) {
            body.classList.add('dark-mode');
        }
    };

    if (toggleButton) {
        toggleButton.addEventListener('click', toggleDarkMode);
    }
    
    loadDarkModeSetting();

    window.addEventListener('scroll', () => {
        if (toTop) {
            if (window.scrollY > 200) {
                toTop.style.opacity = '1';
                toTop.style.pointerEvents = 'auto';
            } else {
                toTop.style.opacity = '0.8';
                toTop.style.pointerEvents = 'none';
            }
        }
    });

    const createTrailElement = (x, y) => {
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        
        const size = Math.random() * 8 + 10; 
        const rotation = Math.random() * 360; 
        trail.style.width = `${size}px`;
        trail.style.height = `${size}px`;
        trail.style.setProperty('--rotation', `${rotation}deg`);

        body.appendChild(trail);

        setTimeout(() => {
            trail.remove();
        }, 1500);
    };

    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.8) { 
            createTrailElement(e.clientX, e.clientY);
        }
    });

    document.addEventListener('click', (e) => {
        for (let i = 0; i < 3; i++) {
            createTrailElement(e.clientX + Math.random() * 10 - 5, e.clientY + Math.random() * 10 - 5);
        }
    });

    const modal = document.getElementById('news-modal');
    const closeBtn = modal.querySelector('.modal-close-btn');
    const contentArea = document.getElementById('modal-detail-content');
    const newsLinks = document.querySelectorAll('.news-title a[data-modal-target]');

    newsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const newsId = e.currentTarget.dataset.modalTarget;
            const detail = newsDetails[newsId];

            if (detail) {
                contentArea.innerHTML = `
                    <h1>${detail.title}</h1>
                    <span class="news-date">${detail.date}</span>
                    <div class="news-content">${detail.content}</div>
                `;
                
                modal.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});