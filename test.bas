Imports System.Net.Http
Imports System.Threading.Tasks

Module Module1

    Public Async Function GetDataFromFirebaseAsync(url As String) As Task(Of String)
        Using client As New HttpClient()
            Dim response As HttpResponseMessage = Await client.GetAsync(url)
            response.EnsureSuccessStatusCode()
            Dim responseBody As String = Await response.Content.ReadAsStringAsync()
            Return responseBody
        End Using
    End Function

    Public Sub Main()
        Dim url As String = "https://your-database.firebaseio.com/your-node.json"
        Dim task As Task(Of String) = GetDataFromFirebaseAsync(url)
        task.Wait()
        Dim result As String = task.Result
        Console.WriteLine(result)
    End Sub

End Module
