import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/env_config.dart';
import '../services/secure_storage.dart';

class ApiClient {
  static final http.Client _client = http.Client();

  static Future<Map<String, String>> _getHeaders({bool isFormEncoded = false}) async {
    final token = await SecureStorage.getToken();
    final headers = <String, String>{
      'Accept': 'application/json',
    };
    if (isFormEncoded) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      headers['Content-Type'] = 'application/json';
    }
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  static Future<http.Response> get(String path) async {
    final uri = Uri.parse('${EnvConfig.baseUrl}$path');
    final headers = await _getHeaders();
    final response = await _client.get(uri, headers: headers);
    _validateResponse(response);
    return response;
  }

  static Future<http.Response> post(String path, {dynamic body, bool isFormEncoded = false}) async {
    final uri = Uri.parse('${EnvConfig.baseUrl}$path');
    final headers = await _getHeaders(isFormEncoded: isFormEncoded);
    final encodedBody = isFormEncoded ? body : json.encode(body);
    final response = await _client.post(uri, headers: headers, body: encodedBody);
    _validateResponse(response);
    return response;
  }

  static Future<http.Response> put(String path, {dynamic body}) async {
    final uri = Uri.parse('${EnvConfig.baseUrl}$path');
    final headers = await _getHeaders();
    final response = await _client.put(uri, headers: headers, body: json.encode(body));
    _validateResponse(response);
    return response;
  }

  static Future<http.Response> delete(String path) async {
    final uri = Uri.parse('${EnvConfig.baseUrl}$path');
    final headers = await _getHeaders();
    final response = await _client.delete(uri, headers: headers);
    _validateResponse(response);
    return response;
  }

  static void _validateResponse(http.Response response) {
    if (response.statusCode >= 400) {
      String errorMessage = 'Request failed with status: ${response.statusCode}';
      try {
        final body = json.decode(response.body);
        if (body is Map && body.containsKey('detail')) {
          errorMessage = body['detail'].toString();
        }
      } catch (_) {}
      throw ApiException(errorMessage, response.statusCode);
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException(this.message, this.statusCode);

  @override
  String toString() => message;
}
