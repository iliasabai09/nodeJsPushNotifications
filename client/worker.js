console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    // Текс пуш уведомления
    body: data.body || "",
    // Иконка пуш уведомления
    icon: data.icon || "",
    // Фотка пуш уведомления
    image: data.image,
    // Указывает на то что экраны с достаточно большим дисплеем можно было чтобы пушка не пропадала автоматом
    requireInteraction: data.requireInteraction || false,
    // Указывает на то что пушка будет без звука
    silent: data.silent,
    // Указывает на то что пугка если еще стоит то можно по идентификатору отправить другую пушку и заменить текущую
    tag: data.tag || "",
    // Принимает массив обьектов с полями action - название события title - имя события icon - иконка события кнопки
    // Потом эти кнопки можно будет отработать в событий notificationclick в сервисном работнике
    actions: data.actions || null,
    // Можно отработать передаваемые данные
    data: data.data,
    renotify: data.renotify || false,
    // timestamp: data.timestamp || null,
    // badge: data.badge || '',
    // dir: data.dir || '',
    // lang: data.lang,
    // vibrate: data.vibrate || [100],
  });
});


self.addEventListener('notificationclick', function (event) {
  event.notification.close(); // Закрыть уведомление

  // Получить URL из свойств data уведомления
  const url = event.notification.data.url;

  // Открыть ссылку в новой вкладке
  event.waitUntil(
      clients.openWindow(url)
  );
});
