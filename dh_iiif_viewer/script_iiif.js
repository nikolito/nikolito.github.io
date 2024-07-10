document.addEventListener("DOMContentLoaded", function (event) {
    // Manifestをロードする関数
    function loadManifest(manifestUrl) {
        if (manifestUrl) {
            // Pluginの組み込み
            const { Mirador, miradorImageToolsPlugin } = integration;
            
            // Miradorのインスタンスを作成
            // windowsにviewer設定を追加
            Mirador.viewer(
                {
                    layout: "1x1",
                    id: "miradorContainer",
                    windows: [
                        {
                            manifestId: manifestUrl,
                            loadedManifest: manifestUrl,
                            slotAddress: "row1.column1",
                            viewType: "ImageView",
                            imageToolsEnabled: true,
                            imageToolsOpen: false,
                        },
                    ],
                },
                miradorImageToolsPlugin
            );

            // Manifest URLの有効性をチェックするためのXMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open("GET", manifestUrl, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        // 成功した場合、エラーメッセージをクリアし、Viewerを表示
                        document.getElementById("error-message").textContent = "";
                        document.getElementById("miradorContainer").style.display = "block";
                        // メッセージ表示領域を表示し、10秒後にフェードアウト
                        const messageElement = document.getElementById("fixed-message");
                        messageElement.style.display = "block";
                        setTimeout(function() {
                            messageElement.classList.add("fade-out");
                            setTimeout(function() {
                                messageElement.style.display = "none";
                                messageElement.classList.remove("fade-out");
                            }, 2000); // フェードアウトの時間を考慮して
                        }, 10000); // 10秒後にフェードアウト開始
                    } else {
                        // 失敗した場合、エラーメッセージを表示し、Viewerを非表示
                        document.getElementById("error-message").textContent = "The Manifest was not found.";
                        document.getElementById("miradorContainer").style.display = "none";
                        // メッセージ表示領域を非表示
                        document.getElementById("fixed-message").style.display = "none";
                    }
                }
            };
            xhr.send();
        }
    }

    // フォームの送信イベントをハンドリング
    document.getElementById("manifestForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const manifestUrl = document.getElementById("manifestUrl").value;
        if (manifestUrl.trim() === "") {
            // 入力フィールドが空の場合、Viewerを非表示
            document.getElementById("miradorContainer").style.display = "none";
            // メッセージ表示領域を非表示
            document.getElementById("fixed-message").style.display = "none";
        } else {
            // 入力フィールドにURLがある場合、Manifestをロード
            loadManifest(manifestUrl);
        }
    });

    // サンプル表示ボタンのイベントをハンドリング
    document.getElementById("showSample").addEventListener("click", function() {
        const sampleManifestUrl = "https://www.loc.gov/item/2021667427/manifest.json";
        document.getElementById("manifestUrl").value = sampleManifestUrl;
        loadManifest(sampleManifestUrl);
    });

    // リセットボタンのイベントをハンドリング
    document.getElementById("manifestForm").addEventListener("reset", function() {
        document.getElementById("miradorContainer").style.display = "none";
        document.getElementById("error-message").textContent = "";
        // メッセージ表示領域を非表示
        document.getElementById("fixed-message").style.display = "none";
    });

    // 入力の長さに応じてtextareaの幅と高さを調整
    document.getElementById("manifestUrl").addEventListener("input", function() {
        // テキストエリアの高さを自動調整
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";

        // テキストエリアの幅を調整
        const width = (this.value.length + 1) * 8;
        if (width > window.innerWidth * 0.8) {
            this.style.width = "80%";
            this.style.whiteSpace = "normal"; // テキストを折り返す
        } else {
            this.style.width = width + 'px';
            this.style.whiteSpace = "nowrap"; // テキストを折り返さない
        }
    });
});
