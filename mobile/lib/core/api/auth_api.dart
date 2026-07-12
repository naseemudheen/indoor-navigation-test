import 'dart:convert';
import '../models/user.dart';
import '../services/secure_storage.dart';
import 'api_client.dart';

class AuthApi {
  static Future<bool> login(String username, String password) async {
    try {
      final body = {
        'username': username,
        'password': password,
      };

      final response = await ApiClient.post(
        '/api/v1/auth/login',
        body: body,
        isFormEncoded: true,
      );

      final data = json.decode(response.body);
      final accessToken = data['access_token'] as String;
      await SecureStorage.saveToken(accessToken);
      return true;
    } catch (e) {
      rethrow;
    }
  }

  static Future<User> getMe() async {
    try {
      final response = await ApiClient.get('/api/v1/auth/me');
      final data = json.decode(response.body);
      return User.fromJson(data);
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> logout() async {
    await SecureStorage.clearToken();
  }
}
